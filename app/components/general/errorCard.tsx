import { Button } from "@components";

type errorCardProps = {
  errorHeading: string;
  errorMessage: string;
  errorStack?: string;
  cb?: () => void;
  buttonMessage?: string;
}

export default function ErrorCard({ errorHeading, errorMessage, errorStack, cb, buttonMessage = 'Retry'}: errorCardProps) {

  return (
    <div className="errorBoundary">
      <h2 className="error-heading" role="alert" aria-live="assertive">
        {errorHeading}
      </h2>
      <p className="error-message">
        {errorMessage}
        {errorStack && (
          <pre className="error-stackTrack">
            {errorStack}
          </pre>
        )}
      </p>
      {cb && <Button onClick={cb}>{buttonMessage}</Button>}
    </div>
  )
}