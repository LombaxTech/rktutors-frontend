import React, { useState, useEffect } from "react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import useCustomAuth from "../customHooks/useCustomAuth";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const SelectPaymentMethod = () => {
  const { user, userLoading } = useCustomAuth();

  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function init() {
      try {
      } catch (error) {
        console.log(error);
      }
    }

    if (user && !userLoading) init();
  }, [user, userLoading]);

  return (
    <div className="">
      {cards.length === 0 && (
        <div className="">
          <h1 className="text-3xl font-bold">
            You have no saved payment methods
          </h1>

          <div className="flex flex-col items-center">
            <div className="w-full p-8 ">
              <CardElement
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: "18px",
                    },
                  },
                }}
                className="shadow-md p-4 rounded-lg text-3xl"
              />
            </div>
            <button className="btn btn-secondary">Add Card</button>
            <div className="font-light my-4">
              This card will be used for booking your lesson
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function BookingStepper() {
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  return (
    <div className=" flex-1 flex flex-col">
      <div className="flex-1">
        <Steps activeStep={activeStep}>
          {/* Time Picking */}
          <Step label="Choose A Time">
            <div className="bg-green-200 flex-1">time picking...</div>
          </Step>

          {/* Payment */}
          <Step label="Payment Details">
            <div className="flex flex-col justify-center items-center mt-4">
              <SelectPaymentMethod />
            </div>
          </Step>

          <Step label="Confirm Booking">confirmation...</Step>
        </Steps>
      </div>

      <div className="flex gap-4 p-8">
        <button
          onClick={prevStep}
          disabled={activeStep === 0}
          className="btn btn-primary"
        >
          {/* <ArrowBackIcon />  */}
          back
        </button>

        <button
          onClick={nextStep}
          disabled={activeStep === 2}
          className="btn btn-secondary"
        >
          next
          {/* <ArrowForwardIcon size={"2xl"} /> */}
        </button>
      </div>
    </div>
  );
}
