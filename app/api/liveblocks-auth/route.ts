import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { redirect } from "next/navigation";

const liveblocks = new Liveblocks({
  secret:
    "sk_dev_nnaiSzWjptNLkqxXrMjSPOT6WNPdZldbzl1LTWlvDYEc54dOj9rya_nF4817KNaA",
});

export async function POST(request: Request) {
  const clearkUser = await currentUser();

  if (!clearkUser) {
    redirect("/sign-in");
  }

  const { id, firstName, lastName, emailAddresses, imageUrl } = clearkUser;

  // Get the current user from your database
  const user = {
    id: id,
    info: {
      firstName,
      lastName,
      email: emailAddresses[0].emailAddress,
      imageUrl,
    },
  };

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.id,
      groupIds, // Optional
    },
    { userInfo: user.metadata }
  );

  return new Response(body, { status });
}
