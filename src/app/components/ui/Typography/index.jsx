"use client"


export const HeadTypo = ({label}) => {
    return(
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
            {label}
          </p>
    )
}

export const BodyTypo = ({ bodylabel }) => {
    return (
      <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-zinc-500 dark:text-zinc-300">
        {bodylabel}
      </h2>
    );
  };

  export const FootTypo = ({footlabel}) => {
    return (
      <p className="mx-auto mt-4 max-w-2xl text-lg font-normal text-zinc-500 dark:text-zinc-300 lg:text-xl lg:leading-8">
        {footlabel}
      </p>
    );
  };