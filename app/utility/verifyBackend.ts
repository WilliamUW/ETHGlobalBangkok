"use server";

import { VerificationLevel } from "@worldcoin/idkit-core";
import { verifyCloudProof } from "@worldcoin/idkit-core/backend";

export type VerifyReply = {
  success: boolean;
  code?: string;
  attribute?: string | null;
  detail?: string;
};

interface IVerifyRequest {
  proof: {
    nullifier_hash: string;
    merkle_root: string;
    proof: string;
    verification_level: VerificationLevel;
  };
  signal?: string;
}

const app_id = "app_4020275d788fc6f5664d986dd931e5e6";
const action = "verify";

export async function verify(
  proof: IVerifyRequest["proof"],
  signal?: string
): Promise<VerifyReply> {
  console.log(proof, app_id, action, signal);
  const verifyRes = await verifyCloudProof(proof, app_id, action, signal);
  console.log(verifyRes);
  return { success: true };
}
