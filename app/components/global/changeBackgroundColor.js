import * as SystemUI from "expo-system-ui";
import { COLORS } from "../../constants";

export async function changeBackground() {
  const color = COLORS.background; // 8 digit hex color code
  await SystemUI.setBackgroundColorAsync(color);
}
