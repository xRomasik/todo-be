type SpinnerProps = {
  loadingMessage?: string;
};

export const Spinner = (props: SpinnerProps) => {
  const { loadingMessage } = props;

  return (
    <div className="loading">
      <div className="loading__spinner"></div>
      {loadingMessage ? <p>{loadingMessage}</p> : null}
    </div>
  );
};
