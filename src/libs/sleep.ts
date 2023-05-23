import { secToMilliSec } from "./secToMilliSec";

export const sleep = async (seconds = 1): Promise<void> =>
  new Promise((res) => setTimeout(res, secToMilliSec(Math.max(0, seconds))));