import { Menu, ActionIcon, Modal, Container } from "@mantine/core";
import AuthForm from "./AuthForm";
import { IconUser, IconUserCog } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { logout } from "../../redux/auth-slice";

export default function FloatingUserMenu() {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const auth = useSelector((state) => (state as RootState).auth);
  const dispatch = useDispatch();

  // Close modal when logged in
  useEffect(() => {
    if (auth.loggedIn) {
      close();
    }
  }, [auth.loggedIn, close]);

  return (
    <Container sx={{ position: "fixed", top: 0, right: 0, padding: 14 }}>
      <Menu
        shadow="md"
        width={200}
        opened={userMenuOpened}
        onChange={setUserMenuOpened}
        position="left-start"
      >
        <Menu.Target>
          <ActionIcon variant="filled" color="blue" size="xl">
            {auth.loggedIn ? (
              <IconUserCog size="2.125rem" />
            ) : (
              <IconUser size="2.125rem" />
            )}
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {auth.loggedIn ? (
            <>
              <Menu.Label>You are logged in as {auth.email}</Menu.Label>
              <Menu.Item
                onClick={() => {
                  localStorage.removeItem("auth");
                  dispatch(logout());
                }}
                icon={<IconUser size={14} />}
              >
                Logout
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Label>You are not logged in</Menu.Label>
              <Menu.Item onClick={open} icon={<IconUser size={14} />}>
                Login
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>

      <Modal opened={opened} onClose={close} title="Authentication">
        <AuthForm />
      </Modal>
    </Container>
  );
}
