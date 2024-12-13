import Header from "@/components/shared/Header";
import React from "react";
import { transformationTypes } from "@/constants";
import TransformationForm from "@/components/shared/TransformationForm";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/users.actions";

const AddtransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const Transformation = transformationTypes[type];
  const { userId } = auth();
  const user = await getUserById(userId!);
  return (
    <>
      <Header title={Transformation.title} subtitle={Transformation.subTitle} />
      <section className="mt-10">
        <TransformationForm
          action={"Add"}
          userId={user._id}
          type={Transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddtransformationTypePage;
