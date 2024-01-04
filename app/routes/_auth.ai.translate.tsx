import { json, type ActionFunctionArgs } from "@remix-run/node";
import chalk from "chalk";

export async function action({ request }: ActionFunctionArgs) {
  const posted = Object.fromEntries(await request.formData());
  console.log(posted);
  try {
    return json({ test: 1 });
  } catch (e) {
    console.error(chalk.red(`Failed to translate with AI`));
    return json({
      test: 0,
    });
  }
}
