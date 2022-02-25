import { Experience } from "@local-civics/js-client";
import React from "react";
import { Button, Icon, Modal } from "../../../../components";
import { builder } from "../../../../utils/classname/classname";

export type CardProps = Experience & {
  status?: "registered" | "unregistered" | "in-progress";
  resolving?: boolean;
  visible?: boolean;
  onRegister?: () => void;
  onUnregister?: () => void;
  onClose?: () => void;
  onJoin?: () => void;
  onSkillClick?: (skill: string) => void;
};

export const Card = (props: CardProps) => {
  const className = builder("w-full md:w-[40rem]").if(!!props.resolving, "min-h-[20rem]").build();

  const [status, setStatus] = React.useState(props.status);
  React.useEffect(() => {
    if (status !== props.status) {
      setStatus(props.status);
    }
  }, [props.status]);

  const onRegister = () => {
    setStatus("registered");
    if (props.onRegister) {
      props.onRegister();
    }
  };

  const onUnregister = () => {
    setStatus("unregistered");
    if (props.onUnregister) {
      props.onUnregister();
    }
  };

  const cta = (() => {
    switch (status) {
      case "in-progress":
        return (
          <Button
            onClick={props.onJoin}
            theme="dark"
            border="rounded"
            size="sm"
            spacing="md"
            color="green"
            text="Join"
          />
        );
      case "unregistered":
        return (
          <Button
            onClick={onRegister}
            theme="dark"
            border="rounded"
            size="sm"
            spacing="md"
            color="sky"
            text="Register"
          />
        );
      case "registered":
        return (
          <Button
            onClick={onUnregister}
            theme="dark"
            border="rounded"
            size="sm"
            spacing="md"
            color="slate"
            text="Registered"
          />
        );
    }
  })();

  return (
    <Modal resolving={props.resolving} visible={props.visible} onClose={props.onClose}>
      <div className={className}>
        <img className="w-full h-60 object-cover" alt={props.displayName} src={props.imageURL} />
        <div className="w-full grid grid-cols-1 gap-2 sm:flex p-5 border-b border-gray-200">
          <div className="flex items-start grow">
            <div className="inline-block min-w-6 w-6 h-6 text-slate-600">
              <Icon name={props.pathway || "explore"} />
            </div>

            <div className="grow align-top ml-2 inline-block leading-none">
              <p className="font-semibold capitalize text-slate-600 text-lg -mt-1.5">{props.displayName}</p>
              <div>
                <p className="text-xs inline-block capitalize text-slate-600">{props.pathway}</p>
                {props.quality && (
                  <p className="ml-1 font-semibold inline-block text-xs text-green-500">{props.quality} pts</p>
                )}
              </div>
            </div>
          </div>

          {cta}
        </div>

        <div className="w-full max-h-[20rem] overflow-scroll">
          <div className="w-full p-5 border-b border-gray-200 grid grid-cols-1 gap-4">
            {props.summary && (
              <div className="text-slate-600 grid grid-cols-1 gap-4">
                <p className="font-semibold text-lg">Summary</p>
                <p className="text-sm">{props.summary}</p>
              </div>
            )}

            {props.skills && props.skills.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                <p className="text-slate-600 font-semibold text-lg">Skills</p>
                <div className="flex gap-2">
                  {props.skills.map((skill, i) => {
                    return (
                      <button
                        onClick={() => props.onSkillClick && props.onSkillClick(skill)}
                        key={skill + i}
                        className="grow-0 cursor-pointer shadow-sm text-center font-semibold inline-block rounded-md capitalize bg-gray-100 hover:bg-gray-50 active:bg-gray-50 focus:bg-gray-50 px-4 py-2 text-xs text-gray-600"
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="w-full p-5 border-b border-gray-200 grid grid-cols-1 gap-4">
            {(props.address || props.externalURL || props.notBefore) && (
              <div className="text-slate-600 grid grid-cols-1 gap-4">
                <p className="font-semibold text-lg">Details</p>
                <div className="grid grid-cols-1 gap-8">
                  {props.address && (
                    <div className="flex gap-1 items-center">
                      <div className="grow-0 w-6 h-6 min-w-6 text-slate-600">
                        <Icon name="pin" />
                      </div>
                      <div className="grow font-medium inline-block capitalize px-4 py-2 text-sm text-slate-600">
                        {props.address}
                      </div>
                    </div>
                  )}

                  {props.notBefore && (
                    <div className="flex gap-1 items-center">
                      <div className="grow-0 w-6 h-6 min-w-6 text-slate-600">
                        <Icon name="clock" />
                      </div>
                      <div className="grow font-medium inline-block px-4 py-2 text-sm text-slate-600">
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "full",
                          timeStyle: "long",
                        }).format(new Date(props.notBefore))}
                      </div>
                    </div>
                  )}

                  {props.externalURL && (
                    <div className="flex gap-1 items-center">
                      <div className="grow-0 w-6 h-6 min-w-6 text-slate-600">
                        <Icon name="globe" />
                      </div>
                      <div className="grow font-medium inline-block px-4 py-2 text-sm text-slate-600 hover:underline">
                        <a href={props.externalURL}>{props.externalURL}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
