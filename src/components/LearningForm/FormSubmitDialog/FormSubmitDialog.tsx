import React    from "react";
import {Button} from "../../Button";
import {Icon}   from "../../Icon";
import {Modal}  from "../../Modal";

/**
 * FormSubmitDialogProps
 */
export type FormSubmitDialogProps = {
  onReview?: () => void;
  onExit?: () => void;
};

/**
 * FormSubmitDialog
 * @param props
 * @constructor
 */
export const FormSubmitDialog = (props: FormSubmitDialogProps) => {
  return (
      <Modal visible transparent onClose={props.onReview}>
        <div className="w-full md:w-[24rem] px-8 py-5 shadow-sm grid grid-cols-1 gap-4 content-center justify-items-center">
          <div className="text-green-500 w-14 h-14">
            <Icon name="positive" />
          </div>

          <div className="text-slate-600 text-center">
            <div className="font-bold text-lg">
              <span>Great Job!</span>
            </div>
            <p className="text-sm max-w-[16rem]">Your responses have been submitted.</p>
          </div>

          <div className="my-5 grid grid-cols-2 gap-4">
            <Button
                wide
                spacing="md"
                border="rounded"
                color="blue"
                theme="dark"
                text="Review"
                size="md"
                onClick={props.onReview}
            />

            <Button
                wide
                spacing="md"
                border="rounded"
                color="blue"
                theme="dark"
                text="Exit"
                size="md"
                onClick={props.onExit}
            />
          </div>
        </div>
      </Modal>
  );
};
