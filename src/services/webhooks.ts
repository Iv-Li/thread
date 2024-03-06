import {
  addMemberToCommunity,
  createCommunity, deleteCommunity, deleteMemberFromCommunity,
  IAddMemberToCommunity,
  type ICreateCommunity, IDeleteMemberFromCommunity, IUpdateCommunityInfo, updateCommunityInfo
} from '@/services/communities';
import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/handleError';

export const onWhOrganisationCreated = handleApiError(async (params: ICreateCommunity) => {
  await createCommunity(params)
  return NextResponse.json({ message: "User created" }, { status: 201 });
})

export const onWhOrganisationInvitationCreated = handleApiError(async () => {
  {/*TODO: add invitation notification*/}
  return NextResponse.json({ message: "Invitation created" },{ status: 201 })
})

export const onWhOrganisationMemberCreated = handleApiError(async (params: IAddMemberToCommunity) => {
  await addMemberToCommunity(params)
  return NextResponse.json({ message: "Invitation accepted" },{ status: 201 })
})


export const onWhDeleteMemberFromOrganization = handleApiError(async (params: IDeleteMemberFromCommunity) => {
  await deleteMemberFromCommunity(params)
  return NextResponse.json({ message: "Member removed" },{ status: 201 })
})

export const onWhOrganizationUpdate = handleApiError(async (params: IUpdateCommunityInfo) => {
  await updateCommunityInfo(params)
  return NextResponse.json({ message: "Community info updated" },{ status: 201 })
})


export const onWhOrganizationDelete = handleApiError(async (communityId: string) => {
  await deleteCommunity(communityId)
  return NextResponse.json({ message: "Community deleted" },{ status: 201 })
})