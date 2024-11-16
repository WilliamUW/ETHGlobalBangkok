import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const proof = await request.json();
    console.log('Received proof:', proof);
    
    // Your verification logic here
    
    return NextResponse.json({ message: 'Verification successful' });
  } catch (error) {
    console.error('Error processing verification:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }
}
// import { type IVerifyResponse, verifyCloudProof } from "@worldcoin/idkit";
// import { NextRequest, NextResponse } from 'next/server';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const proof = req.body;
//   const app_id = "app_4020275d788fc6f5664d986dd931e5e6";
//   const action = "verify";
//   const verifyRes = (await verifyCloudProof(
//     proof,
//     app_id,
//     action
//   )) as IVerifyResponse;

//   if (verifyRes.success) {
//     // This is where you should perform backend actions if the verification succeeds
//     // Such as, setting a user as "verified" in a database
//     res.status(200).send(verifyRes);
//   } else {
//     // This is where you should handle errors from the World ID /verify endpoint.
//     // Usually these errors are due to a user having already verified.
//     res.status(400).send(verifyRes);
//   }
// }
