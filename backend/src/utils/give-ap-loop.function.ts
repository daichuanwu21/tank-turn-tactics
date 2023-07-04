import { open } from "fs/promises";
import logger from "../logger";
import { Tank } from "../models";

const giveAPLoop = async () => {
  const fileHandle = await open("./last_time_ap_given.txt", "w+");
  const fileContents = await fileHandle.readFile("utf8");

  let lastGiven: Date;
  if (fileContents) {
    lastGiven = new Date(parseInt(fileContents));
  } else {
    lastGiven = new Date(0);
  }

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  if (lastGiven.getTime() < startOfToday.getTime()) {
    const liveTanks = await Tank.find({
      healthPoints: {
        $gte: 1,
      },
    });

    for (const tank of liveTanks) {
      tank.actionPoints = tank.actionPoints + 1;
      tank.save();
    }

    await fileHandle.writeFile(now.getTime().toString());
    logger.info(`AP already given today`);
  } else {
    logger.info(`AP last given at ${lastGiven.getTime()}`);
  }

  await fileHandle.close();

  const oneDayInMillis = 24 * 60 * 60 * 1000;
  const timeRemainingToNextDay =
    startOfToday.getTime() + oneDayInMillis - now.getTime();
  const timeToWait = timeRemainingToNextDay + Math.random() * oneDayInMillis;
  logger.info(`Next AP give in ${timeToWait} ms`);

  setTimeout(giveAPLoop, timeToWait);
};

export default giveAPLoop;
