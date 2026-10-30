import rawNavigation from "@/data/navigation.json";
import { NavigationSchema, type Navigation } from "@/lib/types";

const navigation = NavigationSchema.parse(rawNavigation);

export async function getNavigation(): Promise<Navigation> {
  "use cache";
  return navigation;
}
