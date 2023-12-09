export const Divider = ({ className }: { className?: string }) => {
  let dividerStyle =
    "h-[3px] w-full bg-gradient-to-r my-[1rem] from-sky-800 to-sky-500";
  if (className) {
    dividerStyle += " " + className;
  }

  return <div className={dividerStyle} />;
};
