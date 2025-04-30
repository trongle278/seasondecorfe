"use client"

import clsx from "clsx";


export const HeadTypo = ({label}) => {
    return(
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
            {label}
          </p>
    )
}

export const BodyTypo = ({ bodylabel }) => {
    return (
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-zinc-500 dark:text-zinc-300">
        {bodylabel}
      </h2>
    );
  };

  export const FootTypo = ({footlabel, className}) => {
    return (
      <span className={clsx("", className)}>
        {footlabel}
      </span>
    );
  };