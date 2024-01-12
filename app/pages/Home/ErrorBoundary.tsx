import { ErrorCard } from '@components';
import { redirect } from '@remix-run/node';
import { isRouteErrorResponse, useRouteError } from '@remix-run/react';


export function ErrorBoundary() {
  const error = useRouteError();

  let errorHeading: string, errorMessage: string, errorStack: string | undefined;

  function handleRetry(){
    return redirect("/");
  }

  if (isRouteErrorResponse(error)) {
    errorHeading = `${error.status} ${error.statusText}`;
    errorMessage = `${error.data}`;
  } else if (error instanceof Error) {
    errorStack = JSON.stringify(error.stack, null, 2);
    errorHeading = 'Error';
    errorMessage = error.message;
  } else {
    errorHeading = 'Unknown Error';
    errorMessage = 'An unknown error occurred.';
  }

  return (
  <div className=''>
  <ErrorCard errorHeading={errorHeading} errorMessage={errorMessage} errorStack={errorStack} cb={handleRetry} buttonMessage="reload application"/>
  </div>
  )
}