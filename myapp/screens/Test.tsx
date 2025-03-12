import { Button, Text } from "react-native";
import { useAuth0, Auth0Provider } from "react-native-auth0";

const Test = () => {
  const { authorize } = useAuth0();
  const { clearSession } = useAuth0();
  const { user, error } = useAuth0();

  const onPressLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log(e);
    }
  };

  const onPressLogin = async () => {
    try {
      await authorize();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {user && <Text>Logged in as {user.name}</Text>}
      {!user && <Text>Not logged in</Text>}
      {error && <Text>{error.message}</Text>}
      <Button onPress={onPressLogin} title="Log in" />
      <Button onPress={onPressLogout} title="Log out" />
    </>
  );
};

export default Test;
