import { useCallback, useMemo } from "react";
import * as constants from "../../constants";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  ITankDocument,
  useActionPointsQuery,
  useAddHealthPointMutation,
  useGiveActionPointMutation,
  useGiveHealthPointMutation,
  useMoveMutation,
  useShootMutation,
  useUpgradeRangeMutation,
} from "../../redux/game-api";
import { useDisclosure } from "@mantine/hooks";
import { Button, Container, Group, Modal, SimpleGrid } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

interface ITankProps {
  tank: ITankDocument;
}

export default function Tank({ tank }: ITankProps) {
  const auth = useSelector((state) => (state as RootState).auth);

  const [modalOpened, { open: modalOpen, close: modalClose }] =
    useDisclosure(false);

  // Calculate pixel position on grid from tank coordinates
  const positionOnGrid = useMemo(() => {
    const topOffset = tank.positionY * constants.SQUARE_SIZE;

    const leftOffset = tank.positionX * constants.SQUARE_SIZE;

    return [topOffset, leftOffset];
  }, [tank]);

  const tankColour = useMemo(() => {
    const limitedRange = tank.range > 5 ? 5 : tank.range;

    const colour1 = [140, 140, 140]; // grey
    let colour2 = [255, 215, 0]; // gold
    if (auth.loggedIn && auth.tankId === tank.id) colour2 = [50, 222, 132]; // green

    if (tank.healthPoints <= 0) {
      return `${colour1[0]},${colour1[1]},${colour1[2]},0.5`;
    }

    // Interpolate between dull and bright colour to show range
    const red = (colour2[0] - colour1[0]) * (limitedRange / 5) + colour1[0];
    const green = (colour2[1] - colour1[1]) * (limitedRange / 5) + colour1[1];
    const blue = (colour2[2] - colour1[2]) * (limitedRange / 5) + colour1[2];

    return `${red},${green},${blue},0.5`;
  }, [tank, auth]);

  const healthText = useMemo(() => {
    if (tank.healthPoints <= 0) {
      return "💀";
    }

    if (tank.healthPoints <= 3) {
      return "❤️".repeat(tank.healthPoints);
    }

    return `❤️ ${tank.healthPoints}`;
  }, [tank]);

  const [move] = useMoveMutation();
  const [addHealthPoint] = useAddHealthPointMutation();
  const [upgradeRange] = useUpgradeRangeMutation();
  const [shoot] = useShootMutation();
  const [giveActionPoint] = useGiveActionPointMutation();
  const [giveHealthPoint] = useGiveHealthPointMutation();
  const { data: actionPoints, isLoading, refetch } = useActionPointsQuery({});

  type MovementTypes =
    | "left-up"
    | "up"
    | "right-up"
    | "left"
    | "right"
    | "left-down"
    | "down"
    | "right-down";
  type ActionTypes =
    | `move-${MovementTypes}`
    | "add-health-point"
    | "upgrade-range"
    | "shoot"
    | "give-action-point"
    | "give-health-point";
  const handleAction = useCallback(
    async (action: ActionTypes) => {
      const notifID = "tank-interaction" + Math.random().toString();
      notifications.show({
        id: notifID,
        loading: true,
        title: "Sending move",
        message: "The server is registering your move",
        autoClose: false,
        withCloseButton: false,
      });

      let interactionResult;

      if (auth.tankId === tank.id) {
        switch (action) {
          case "move-left-up":
            interactionResult = await move({
              positionX: tank.positionX - 1,
              positionY: tank.positionY - 1,
            });
            break;
          case "move-up":
            interactionResult = await move({
              positionX: tank.positionX,
              positionY: tank.positionY - 1,
            });
            break;
          case "move-right-up":
            interactionResult = await move({
              positionX: tank.positionX + 1,
              positionY: tank.positionY - 1,
            });
            break;
          case "move-left":
            interactionResult = await move({
              positionX: tank.positionX - 1,
              positionY: tank.positionY,
            });
            break;
          case "move-right":
            interactionResult = await move({
              positionX: tank.positionX + 1,
              positionY: tank.positionY,
            });
            break;
          case "move-left-down":
            interactionResult = await move({
              positionX: tank.positionX - 1,
              positionY: tank.positionY + 1,
            });
            break;
          case "move-down":
            interactionResult = await move({
              positionX: tank.positionX,
              positionY: tank.positionY + 1,
            });
            break;
          case "move-right-down":
            interactionResult = await move({
              positionX: tank.positionX + 1,
              positionY: tank.positionY + 1,
            });
            break;
          case "upgrade-range":
            interactionResult = await upgradeRange({});
            break;
          case "add-health-point":
            interactionResult = await addHealthPoint({});
            break;
        }
      } else {
        switch (action) {
          case "shoot":
            interactionResult = await shoot({ targetTankId: tank.id });
            break;

          case "give-action-point":
            interactionResult = await giveActionPoint({
              targetTankId: tank.id,
            });
            break;

          case "give-health-point":
            interactionResult = await giveHealthPoint({
              targetTankId: tank.id,
            });
            break;
        }
      }

      if (!interactionResult || "error" in interactionResult) {
        console.log(interactionResult);
        return notifications.update({
          id: notifID,
          color: "red",
          title: "Move failed",
          message: (interactionResult as any).error.data.detail,
          autoClose: 2000,
        });
      }

      notifications.update({
        id: notifID,
        color: "teal",
        title: "Move successful",
        message: (interactionResult as any).data.detail,
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });

      refetch();
    },
    [tank, auth]
  );

  return (
    <>
      <Container
        sx={{
          height: constants.SQUARE_SIZE,
          width: constants.SQUARE_SIZE,

          // Hacky way to place Tanks on the grid
          // i.e. use grid as parent div with absolute positioning and calculated offsets to place Tank
          position: "absolute",
          top: positionOnGrid[0],
          left: positionOnGrid[1],

          display: "flex",
          flexDirection: "column",

          justifyContent: "center",
          alignItems: "center",

          borderRadius: 15,
          backgroundColor: `rgba(${tankColour})`,
        }}
      >
        {auth.loggedIn && (
          <Container
            sx={{
              position: "absolute",
            }}
          >
            <button
              style={{
                height: constants.SQUARE_SIZE,
                width: constants.SQUARE_SIZE,
                color: "transparent",
                backgroundColor: "transparent",
                border: "none",
              }}
              onClick={modalOpen}
            />
          </Container>
        )}

        <p style={{ margin: 0 }}>{tank.displayName}</p>
        <p style={{ margin: 0 }}>{healthText}</p>
        <p style={{ margin: 0 }}>R: {tank.range}</p>
      </Container>
      <Modal opened={modalOpened} onClose={modalClose} title="Actions">
        <Group position="center">
          {auth.tankId === tank.id ? (
            <>
              {isLoading ? (
                <p style={{ margin: 0 }}>AP: loading...</p>
              ) : (
                actionPoints && (
                  <p style={{ margin: 0 }}>AP: {actionPoints.ap}</p>
                )
              )}
              <p style={{ margin: 0 }}>Move (-1AP)</p>
              <SimpleGrid cols={3} spacing="xs" verticalSpacing="xs">
                <Button onClick={() => handleAction("move-left-up")}>
                  Upper-left
                </Button>
                <Button onClick={() => handleAction("move-up")}>Move Up</Button>
                <Button onClick={() => handleAction("move-right-up")}>
                  Upper-right
                </Button>
                <Button onClick={() => handleAction("move-left")}>Left</Button>
                <p
                  style={{
                    margin: 0,
                    alignSelf: "center",
                    textAlign: "center",
                  }}
                >
                  You
                </p>
                <Button onClick={() => handleAction("move-right")}>
                  Right
                </Button>
                <Button onClick={() => handleAction("move-left-down")}>
                  Lower-left
                </Button>
                <Button onClick={() => handleAction("move-down")}>Down</Button>
                <Button onClick={() => handleAction("move-right-down")}>
                  Lower-right
                </Button>
              </SimpleGrid>
              <Button
                color="green"
                onClick={() => handleAction("add-health-point")}
              >
                Add Health Point (-3 AP)
              </Button>
              <Button onClick={() => handleAction("upgrade-range")}>
                Upgrade Range (-3AP)
              </Button>
            </>
          ) : (
            <>
              <Button color="red" onClick={() => handleAction("shoot")}>
                Shoot (-1 AP)
              </Button>
              <Button
                color="green"
                onClick={() => handleAction("give-health-point")}
              >
                Give Health Point (-1 HP)
              </Button>
              <Button onClick={() => handleAction("give-action-point")}>
                Give Action Point (-1 AP)
              </Button>
            </>
          )}
        </Group>
      </Modal>
    </>
  );
}
