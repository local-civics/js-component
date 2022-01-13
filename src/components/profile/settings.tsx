import {Identity, useClient}        from "@local-civics/js-gateway";
import React, { FunctionComponent } from "react";
import {useNavigate, useParams}     from "react-router-dom";
import { Icon }                     from "../icon";
import {useIdentity}                   from "../identity/hooks";
import { Loader }                      from "../loader";
import {useIdentify}             from "./hooks";

/**
 * Settings
 * @constructor
 * todo: validate input
 */
export const Settings: FunctionComponent = () => {
  const client = useClient()
  const navigate = useNavigate()
  const identify = useIdentify()
  const params = useParams()
  const username = params.username || ""
  const [identity, , isLoading] = useIdentity(username)
  const [changes, setChanges] = React.useState(undefined as Identity | undefined);
  const newIdentity = {...identity, ...changes}
  const avatar = newIdentity.avatar || "https://cdn.localcivics.io/dashboard/avatar.jpg";
  const avatarInput = React.useRef<HTMLInputElement>(null);
  const updateProfile = (key: string, value: string) => {
    setChanges({ ...changes, [key]: value });
  };

  const onSave = async () => {
    if (changes) {
      await client.identity.save("me", newIdentity)
      identify(newIdentity)
    }
    navigate(-1);
  };

  const onAvatarClick = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    let reader = new FileReader();
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        updateProfile("avatar", reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div
      className="grid grid-cols-1 justify-items-center content-center transition ease-in-out duration-300 fixed top-0 w-screen h-screen p-5 bg-gray-500/80 z-50"
    >
      <div className="shadow-md overflow-hidden w-9/12 lg:w-5/12 bg-white rounded-md grid grid-cols-1 justify-items-center">
        <div className="px-5 pt-5 pb-5 grid grid-cols-2 justify-items-end w-full">
          <p className="w-full font-semibold text-gray-700 text-sm">
            Settings
          </p>
          <Icon
            onClick={() => navigate(-1)}
            className="transition ease-in-out cursor-pointer stroke-gray-300 fill-gray-300 hover:stroke-gray-400 hover:fill-gray-400 w-4"
            icon="close"
          />
        </div>

        <div className="w-full max-h-[28rem] overflow-scroll">
          <div className="h-[20rem]">
            <Loader isLoading={isLoading}>
              <div className="h-28 lg:h-48 w-full bg-gray-200" />
              <div className="relative ml-2 -mt-20 lg:-mt-28">
                <input
                  ref={avatarInput}
                  className="invisible"
                  type="file"
                  name="avatar"
                  onChange={(e) => onAvatarClick(e)}
                />
                <img
                  onClick={() => avatarInput.current && avatarInput.current.click()}
                  src={avatar}
                  alt="avatar"
                  className="cursor-pointer border-4 w-20 h-20 lg:w-36 lg:h-36 rounded-full object-cover"
                />
              </div>

              <div className="p-5 w-full">
                <p className="w-full font-semibold text-gray-700 text-xs lg:text-sm">
                  Username
                </p>
                <input
                    min={6}
                    max={30}
                    onChange={(e) => updateProfile("username", e.target.value)}
                    defaultValue={identity.username}
                    className="text-xs lg:text-sm text-gray-500 h-full w-full mt-3 rounded-md bg-gray-200 p-3"
                />
              </div>

              <div className="p-5 w-full">
                <p className="w-full font-semibold text-gray-700 text-xs lg:text-sm">
                  First Name
                </p>
                <input
                  onChange={(e) => updateProfile("givenName", e.target.value)}
                  defaultValue={identity.givenName}
                  className="text-xs lg:text-sm text-gray-500 h-full w-full mt-3 rounded-md bg-gray-200 p-3"
                />
              </div>

              <div className="p-5 w-full">
                <p className="w-full font-semibold text-gray-700 text-xs lg:text-sm">
                  Last Name
                </p>
                <input
                  onChange={(e) => updateProfile("familyName", e.target.value)}
                  defaultValue={identity.familyName}
                  className="text-xs lg:text-sm text-gray-500 h-full w-full mt-3 rounded-md bg-gray-200 p-3"
                />
              </div>

              <div className="p-5 w-full">
                <p className="w-full font-semibold text-gray-700 text-xs lg:text-sm">
                  Grade
                </p>
                <select
                  onChange={(e) => updateProfile("grade", e.target.value)}
                  defaultValue={identity.grade}
                  className="appearance-none text-gray-500 text-xs lg:text-sm h-full w-full mt-3 rounded-md bg-gray-200 p-3"
                >
                  <option>Select a grade</option>
                  <option value="6">6th</option>
                  <option value="7">7th</option>
                  <option value="8">8th</option>
                  <option value="9">9th</option>
                  <option value="10">10th</option>
                  <option value="11">11th</option>
                  <option value="12">12th</option>
                </select>
              </div>

              <div className="p-5 h-60 w-full">
                <p className="w-full font-semibold text-gray-700 text-xs lg:text-sm">
                  Impact Statement
                </p>
                <textarea
                  onChange={(e) => updateProfile("statement", e.target.value)}
                  defaultValue={identity.statement}
                  className="h-full text-sm text-gray-500 w-full mt-3 rounded-md bg-gray-200 p-3"
                />
              </div>

              <div className="p-5 w-full">
                <p className="w-full font-semibold text-gray-700 text-xs lg:text-sm">
                  API Key
                </p>
                <input
                  readOnly
                  defaultValue={"todo: implement me"}
                  className="text-xs lg:text-sm text-gray-500 h-full w-full mt-3 rounded-md bg-gray-200 p-3"
                />
              </div>
            </Loader>
          </div>
        </div>
        <div className="mt-5 mb-5 mr-8 grid justify-items-end w-full">
          <button
            onClick={onSave}
            className="transition-colors rounded-lg font-semibold text-white py-3 px-14 bg-sky-400 hover:bg-sky-500 mt-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
