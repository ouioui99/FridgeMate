import { NavigationProp, useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../App";

export const useNav = useNavigation<NavigationProp<RootStackParamList>>;
