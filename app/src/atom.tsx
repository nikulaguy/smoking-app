import { type cva, cx, type VariantProps } from "class-variance-authority";
import type { ComponentProps, JSX, JSXElementConstructor } from "react";

type CVA = ReturnType<typeof cva>;

type Mapper<P> = (props: Partial<P>) => P;

type AdditionalProps<P> = P | Mapper<P>;

function isMapper<P>(value: unknown): value is Mapper<P> {
	return typeof value === "function";
}

/** Small components factory inspired by Styled Component */
export const atom = <
	// biome-ignore lint/suspicious/noExplicitAny: match react internal typings
	T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
	V extends string | CVA = string,
>(
	Component: T,
	style?: V,
	properties?: AdditionalProps<ComponentProps<T>>,
) => {
	return (
		props: V extends CVA
			? VariantProps<V> & ComponentProps<T>
			: ComponentProps<T>,
	) => {
		const styledProps = {
			...props,
			className:
				typeof style === "function" ? style(props) : cx(props.className, style),
		};
		return (
			<Component
				{...(isMapper<ComponentProps<T>>(properties)
					? properties(styledProps)
					: { ...styledProps, ...properties })}
			/>
		);
	};
};
