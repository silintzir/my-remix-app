interface Props {
  msg?: string;
}
export function ValidationError({ msg }: Props) {
  return <p className="text-sm text-red-600">{msg}</p>;
}
