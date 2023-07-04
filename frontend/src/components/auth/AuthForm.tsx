import { useState } from "react";
import { matchesField, useForm } from "@mantine/form";
import { IconLock, IconAt, IconUserPlus } from "@tabler/icons-react";
import {
  TextInput,
  PasswordInput,
  Group,
  Checkbox,
  Button,
  Paper,
  Text,
  LoadingOverlay,
  Anchor,
} from "@mantine/core";
import isEmail from "validator/es/lib/isEmail";
import isLength from "validator/es/lib/isLength";
import isEmpty from "validator/es/lib/isEmpty";
import { useLoginMutation, useRegisterMutation } from "../../redux/auth-api";
import { useDispatch } from "react-redux";
import { login } from "../../redux/auth-slice";

// Adapted from https://github.com/mantinedev/mantine/blob/ccc4dac49227df268385b3a88cbd04489103866c/src/mantine-demos/src/shared/AuthenticationForm/AuthenticationForm.tsx
export default function AuthForm() {
  const [formType, setFormType] = useState<"register" | "login">("login");
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [loginRequest, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerRequest, { isLoading: isRegisterLoading }] =
    useRegisterMutation();
  const dispatch = useDispatch();

  const toggleFormType = () => {
    setFormType((current) => (current === "register" ? "login" : "register"));
    setError(null);
    setFeedback(null);
  };

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      inviteCode: "",
      termsOfService: false,
    },
    validate: {
      email: (value) =>
        isEmail(value) ? null : "You must enter a valid email",
      password: (value) =>
        isLength(value, { min: 8, max: 1000 })
          ? null
          : "Password must be at least 8 characters long",
      confirmPassword: (value, values) => {
        if (formType === "login") return null;
        return matchesField("password", "Passwords are not the same")(
          value,
          values
        );
      },
      inviteCode: (value) => {
        if (formType === "login") return null;
        return isEmpty(value) ? "You need an invite code to register" : null;
      },
      termsOfService: (value) => {
        if (formType === "login") return null;
        return value ? null : "You must agree to the TOS to register";
      },
    },
    validateInputOnChange: true,
  });
  type FormValues = typeof form.values;

  const handleSubmit = async (values: FormValues) => {
    setError(null);
    setFeedback(null);

    try {
      if (formType === "register") {
        const result = await registerRequest({
          email: values.email,
          password: values.password,
          invite_code: values.inviteCode,
        }).unwrap();

        setFeedback((result as any).detail);
      } else {
        const result = await loginRequest({
          email: values.email,
          password: values.password,
        }).unwrap();

        // Save credentials in local storage
        localStorage.setItem("auth", JSON.stringify(result));

        setFeedback(null);
        dispatch(login(result));
      }
    } catch (err) {
      setError((err as any).data.detail);
    }
  };

  return (
    <Paper
      p={0}
      sx={{
        position: "relative",
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <LoadingOverlay visible={isLoginLoading || isRegisterLoading} />

        <TextInput
          mt="md"
          required
          placeholder="Your email"
          label="Email"
          icon={<IconAt size={16} stroke={1.5} />}
          {...form.getInputProps("email")}
        />

        <PasswordInput
          mt="md"
          required
          placeholder="Password"
          label="Password"
          icon={<IconLock size={16} stroke={1.5} />}
          {...form.getInputProps("password")}
        />

        {formType === "register" && (
          <PasswordInput
            mt="md"
            required
            label="Confirm Password"
            placeholder="Confirm password"
            icon={<IconLock size={16} stroke={1.5} />}
            {...form.getInputProps("confirmPassword")}
          />
        )}

        {formType === "register" && (
          <PasswordInput
            mt="md"
            required
            label="Invite Code"
            placeholder="Invite code"
            icon={<IconUserPlus size={16} stroke={1.5} />}
            {...form.getInputProps("inviteCode")}
          />
        )}

        {formType === "register" && (
          <Checkbox
            mt="xl"
            label="I agree to put milk in my bowl before cereal" // TODO: add actual privacy policy
            {...form.getInputProps("termsOfService", { type: "checkbox" })}
          />
        )}

        {error && (
          <Text color="red" size="sm" mt="sm">
            {error}
          </Text>
        )}

        {feedback && (
          <Text size="sm" mt="sm">
            {feedback}
          </Text>
        )}

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={toggleFormType}
            size="sm"
          >
            {formType === "register"
              ? "Have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>

          <Button color="blue" type="submit">
            {formType === "register" ? "Register" : "Login"}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
