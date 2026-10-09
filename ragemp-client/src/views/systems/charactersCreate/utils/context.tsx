import { createContext, PropsWithChildren, useContext } from 'react';

const Context = createContext({});
export const CharContext: ExpectedAny = () => useContext(Context);

interface ComponentProps {
	passedProps: UndefinedAny;
}

const Component = ({ passedProps, children }: PropsWithChildren<ComponentProps>) => (
	<Context.Provider value={passedProps}>{children}</Context.Provider>
);

export default Component;
