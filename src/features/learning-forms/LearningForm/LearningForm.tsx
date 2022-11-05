import React, {useCallback} from "react";
import { Button, Icon }     from "../../../components";
import { FormExitDialog } from "../FormExitDialog/FormExitDialog";
import { FormItem, FormItemProps } from "../FormItem/FormItem";
import { FormSubmitDialog } from "../FormSubmitDialog/FormSubmitDialog";

const AUTOSAVE_TIMEOUT = 30 * 1000

// A utility for auto-saving drafts
const autoSave = (run?: boolean, func?: (items: FormItemProps[], reflection: string, rating?: number) => Promise<any>, callback?: () => void) => {
  let timeout: NodeJS.Timeout;
  return (items: FormItemProps[], reflection: string, rating?: number) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => run && func && await func(items, reflection, rating).then((e) => {
      if(!e && callback){
        callback()
      }
    }), AUTOSAVE_TIMEOUT);
    return timeout
  };
};

/**
 * LearningFormProps
 */
export type LearningFormProps = {
  formId?: string;
  displayName?: string;
  description?: string;
  eta?: string;
  imageURL?: string;
  reflection?: string;
  rating?: number;
  items?: FormItemProps[];

  onHome?: () => void;
  onGoBack?: () => void;
  onSubmit?: (reflection: string, rating?: number) => Promise<any>;
  onSaveDraft?: (items: FormItemProps[], reflection: string, rating?: number) => Promise<any>
};

/**
 * LearningForm
 * @param props
 * @constructor
 */
export const LearningForm = (props: LearningFormProps) => {
  const [answersKey, setAnswersKey] = React.useState(null as null | string)
  const [reflection, setReflection] = React.useState(props.reflection || "");
  const [rating, setRating] = React.useState(props.rating);
  const [showExitDialogue, setShowExitDialogue] = React.useState(false);
  const [showSubmitDialogue, setShowSubmitDialogue] = React.useState(false);
  const [isDraft, setIsDraft] = React.useState(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const autoSaveHandler = useCallback(autoSave(isDraft, props.onSaveDraft, () => setIsDraft(false)), []);
  const saveVisibility = isDraft ? "opacity-100 visible" : "opacity-0 invisible"
  const answers: FormItemProps[] = []

  let answeredAllRequired = true
  props.items?.forEach(item => {
    if(item.format === "question"){
      answeredAllRequired = answeredAllRequired && !item.required || !!item.responses && item.responses.length > 0
      if(item.responses !== undefined){
        answers.push(item)
      }
    }
  })

  const canReflect = reflection || answeredAllRequired
  const canSubmit = answeredAllRequired && reflection
  const items = props.items || []
  const currentAnswersKey = answers && answers.length > 0 ? JSON.stringify(answers) : ""

  React.useEffect(() => {
    setRating(props.rating);
  }, [props.rating]);

  React.useEffect(() => {
    setReflection(props.reflection || "");
  }, [props.reflection]);

  React.useEffect(() => {
    if(isDraft){
      autoSaveHandler(answers, reflection, rating)
    }
  }, [currentAnswersKey, reflection, rating, isDraft])

  React.useEffect(() => {
    if(answersKey === null){
      setAnswersKey(currentAnswersKey)
      return
    }

    if(answersKey !== currentAnswersKey){
      setAnswersKey(currentAnswersKey)
      setIsDraft(true)
    }
  }, [currentAnswersKey])

  const onReflectionChange = (responses?: string[]) => {
    if (!responses || responses.length === 0) {
      setReflection("");
      return;
    }
    setReflection(responses[0]);
    setIsDraft(true)
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.onSubmit) {
      props.onSubmit(reflection, rating).then((err) => {
        if (!err) {
          setShowSubmitDialogue(true);
          setIsDraft(false)
        }
      });
    }
  };

  return (
      <div className="grid grid-cols-1 gap-y-12 bg-gray-100 px-4 pb-12 lg:px-48">
        <div className="w-full max-w-[62.5rem] m-auto md:grid md:grid-cols-2 bg-white rounded-b overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 gap-y-6 px-8 py-8 text-slate-600 max-w-md">
            <div
                onClick={() => setShowExitDialogue(true)}
                className="flex h-max gap-x-2 cursor-pointer items-center text-slate-300 hover:text-slate-500"
            >
              <div className="w-3 h-3 min-w-3">
                <Icon name="leftArrow" />
              </div>
              <span className="text-md">Go back</span>
            </div>
            {!!props.displayName && <h2 className="h-max font-semibold text-2xl">{props.displayName}</h2>}
            {!!props.description && <p className="h-max max-h-[14rem] overflow-y-auto whitespace-pre-line">{props.description}</p>}
            {!!props.eta && <p className="text-sm h-max font-semibold">Estimated Completion Time: {props.eta}</p>}
          </div>
          <img className="grow h-full max-h-[30rem] w-full object-cover" alt={props.displayName} src={props.imageURL} />
        </div>

        <form className="w-full max-w-[62.5rem] m-auto grid grid-cols-1 gap-y-12" onSubmit={onSubmit}>
          {items.map((props: FormItemProps) => {
            return <FormItem key={props.itemId} {...props} minText={0}/>;
          })}

          <FormItem
              displayName="Almost there, write a short reflection to earn your points!"
              description="(1-2 sentences)"
              format="question"
              questionType="text"
              disabled={!canReflect}
              onResponseChange={onReflectionChange}
              required
              paragraph
              minText={100}
              responses={reflection ? [reflection] : undefined}
          />

          <FormItem>
            <Rating disabled={!canReflect} rating={rating} setRating={setRating} />
          </FormItem>

          <div className="w-max m-auto">
            <Button disabled={!canSubmit} type="submit" color="blue" size="md" spacing="md" border="rounded" theme="dark" text="Submit" />
          </div>
        </form>

        <div className={`fixed bottom-10 right-14 transition ease-in-out ${saveVisibility}`}>
          <Button
              type="button"
              color="dark-blue"
              size="md"
              spacing="md"
              border="rounded"
              theme="dark"
              text="Save"
              onClick={() => {
                props.onSaveDraft && props.onSaveDraft(answers, reflection, rating)
                    .then((e) => !e && setIsDraft(false))
              }}
          />
        </div>

        {showExitDialogue && (
            <div className="fixed top-0 left-0 px-4 md:px-2 w-screen h-screen py-5 transition ease-in-out duration-400 bg-gray-200/75 z-40">
              <div className="flex md:w-max h-screen gap-x-2 justify-items-center content-center m-auto">
                <FormExitDialog onYes={props.onGoBack} onNo={() => setShowExitDialogue(false)} />
              </div>
            </div>
        )}

        {showSubmitDialogue && (
            <div className="fixed top-0 left-0 px-4 md:px-2 w-screen h-screen py-5 transition ease-in-out duration-400 bg-gray-200/75 z-40">
              <div className="flex md:w-max h-screen gap-x-2 justify-items-center content-center m-auto">
                <FormSubmitDialog onGoBack={() => setShowSubmitDialogue(false)} onHome={props.onHome} />
              </div>
            </div>
        )}
      </div>
  );
};

const Rating = (props: { disabled?: boolean, rating?: number; setRating?: (rating: number) => void }) => {
  /**
   * Max points for reflection.
   */
  const [confidence, setConfidence] = React.useState(props.rating || -1);
  const onMouseEnter = (i: number) => !props.disabled && setConfidence(i)
  const onMouseLeave = () => !props.disabled && setConfidence(props.rating || -1)
  const onClick = (i: number) => !props.disabled && props.setRating && props.setRating(i)
  const maxPoints = 5;
  const circlePointer = props.disabled ? "" : "cursor-pointer"

  const buttons = Array.from({ length: maxPoints }, (_, i) => {
    const color = i < confidence ? "text-sky-200" : "text-slate-200";
    return (
        <div key={i} onMouseEnter={() => onMouseEnter(i + 1)} onMouseLeave={onMouseLeave}>
          <div className={`${circlePointer} h-4 w-4 ${color}`} onClick={() => onClick(i + 1)}>
            <Icon name="circle" />
          </div>
        </div>
    );
  });
  const labels = Array.from({ length: maxPoints }, (_, i) => {
    if (i === 0) {
      return (
          <p key={i} className="inline-block text-sm text-monochrome-500">
            Poor
          </p>
      );
    }

    if (i === maxPoints - 1) {
      return (
          <p key={i} className="inline-block text-sm text-monochrome-500">
            Amazing
          </p>
      );
    }

    return <p key={i} className="inline-block text-monochrome-500" />;
  });

  React.useEffect(() => {
    if (props.rating && props.rating !== confidence) {
      setConfidence(props.rating);
    }
  }, [props.rating]);

  return (
      <div className="m-auto inline-block py-4">
        <h6 className="font-bold pb-2 mb-4 text-md text-slate-600 font-semibold">
          {" "}
          Rate your experience from poor to amazing
        </h6>
        <div className="w-max m-auto">
          <div className={`ml-5 w-[17.7rem] grid grid-cols-5 justify-self-center items-center gap-7 mb-2`}>{buttons}</div>
          <div
              className={`ml-5 w-[16.7rem] text-[0.5rem] text-slate-600 grid grid-cols-5 justify-self-center items-center`}
          >
            {labels}
          </div>
        </div>
      </div>
  );
};
