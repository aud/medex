import {setAlertDismissed} from "./local-storage";

interface Props {
  lowAlertThreshold: number;
  highAlertThreshold: number;
  currentBg: number;
}

export class Alert {
  private highAlertThreshold: number;
  private lowAlertThreshold: number;
  private currentBg: number;

  constructor({lowAlertThreshold, highAlertThreshold, currentBg}: Props) {
    this.highAlertThreshold = highAlertThreshold;
    this.lowAlertThreshold = lowAlertThreshold;
    this.currentBg = currentBg;
  }

  get active() {
    return this.high || this.low;
  }

  get type() {
    if (this.high) return "high";
    if (this.low) return "low";

    return null;
  }

  private get high() {
    return this.currentBg >= this.highAlertThreshold;
  }

  private get low() {
    return this.currentBg <= this.lowAlertThreshold;
  }
}

export function writeAlertDismissed() {
  setAlertDismissed("1");
}
