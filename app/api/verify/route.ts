import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const proof = await request.json();
    console.log("Received proof:", proof);

    const app_id = "app_4020275d788fc6f5664d986dd931e5e6";
    const action = "verify";
    // const response = await fetch(
    //   'https://developer.worldcoin.org/api/v2/verify/app_4020275d788fc6f5664d986dd931e5e6',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ ...proof, action: "verify"}),
    //   }
    // );
    // console.log(response)
    // if (response.ok) {
    //   const { verified } = await response.json();
    //   return verified;
    // } else {
    //   const { code, detail } = await response.json();
    //   throw new Error(`Error Code ${code}: ${detail}`);
    // }
    // const verifyRes = (await verifyCloudProof(
    //   proof,
    //   app_id,
    //   action
    // )) as IVerifyResponse;
    // console.log(verifyRes)


    return NextResponse.json({ message: "Verification successful" });
  } catch (error) {
    console.error("Error processing verification:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }
}