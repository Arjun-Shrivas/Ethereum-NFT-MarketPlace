import { useNativeBalance } from "hooks/useNativeBalance";
import { n4 } from "helpers/formatters";

function NativeBalance(props) {
  const { balance, nativeName } = useNativeBalance(props);

  return (
    <div style={{ textAlign: "center", whiteSpace: "nowrap", color: "rgba(255, 255, 255, 0.65)" }}>{`${n4.format(
      balance.formatted
    )} ${nativeName}`}</div>
  );
}

export default NativeBalance;
