declare module 'klasa-api' {
	import { KlasaClient, KlasaClientOptions, Piece, Store, PieceOptions, PieceDefaults, KlasaUser, KlasaGuild } from 'klasa';
	import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http';
	import { SecureContextOptions, Server as HttpSecureServer } from 'tls';
	import { Http2SecureServer } from 'http2';
	import { DataStore, Collection, Permissions } from 'discord.js';
//#region Classes

    export { APIClient as Client };

	export class APIClient extends KlasaClient {
		public constructor(options?: APIClientOptions);
		public options: Required<APIClientOptions>;
		public server: Server;
		public routes: RouteStore;
		public middlewares: MiddlewareStore;
    }

	export class Server {
		public constructor(client: APIClient);
		public client: APIClient;
		public server: HttpServer | HttpSecureServer | Http2SecureServer;
		public onNoMatch: (request: IncomingMessage, response: ServerResponse) => void;
		public listen(port: number): Promise<void>;
		public handler(request: IncomingMessage, response: ServerResponse): Promise<void>;
		public onError(error: Error | ErrorLike, request: KlasaIncomingMessage, response: ServerResponse): void;
	}

	export abstract class Middleware extends Piece {
		public constructor(client: APIClient, store: MiddlewareStore, file: string[], directory: string, options?: MiddlewareOptions);
		public priority: number;
		public abstract run(request: KlasaIncomingMessage, response: ServerResponse, route?: Route): Promise<void>;
	}

	export class MiddlewareStore extends Store<string, Middleware, typeof Middleware> {
		public sortedMiddlewares: Middleware[];
		public run(request: KlasaIncomingMessage, response: ServerResponse, route?: Route): Promise<void>;
	}

	export abstract class Route extends Piece {
		public constructor(client: APIClient, store: RouteStore, file: string[], directory: string, options?: RouteOptions);
		public authenticated: boolean;
		public parsed: ParsedRoute;
		public route: string;
		public matches(split: string[]): boolean;
		public execute(split: string[]): Record<string, any>;
	}

	export class RouteStore extends Store<string, Route, typeof RouteStore> {
		public registry: Record<string, Map<string, Route>>;
		public findRoute(method: string, splitURL: string[]): Route | undefined;
	}

	export const constants: Constants;

	export class Util {
		public static parsePart(val: string): ParsedPart;
		public static split(url: string): string[];
		public static parse(url: string): ParsedPart[];
		public static encrypt(data: any, secret: string): string;
		public static decrypt(token: string, secret: string): any;
	}

//#endregion Classes
//#region Types

	export interface KlasaAPIOptions {
		prefix?: string;
		origin?: string;
		port?: number;
		http2?: boolean;
		sslOptions?: SecureContextOptions;
	}

	export interface APIClientOptions extends KlasaClientOptions {
		api?: KlasaAPIOptions;
	}

	export interface KlasaIncomingMessage extends IncomingMessage {
		originalUrl: string;
		path: string;
		search: string;
		query: Record<string, string | string[]>;
		params: Record<string, any>;
	}

	export interface RouteOptions extends PieceOptions {
		route?: string;
		authenticated?: boolean;
	}

	export interface MiddlewareOptions extends PieceOptions {
		priority?: number;
	}

	export interface ErrorLike {
		code?: number;
		status?: number;
		statusCode?: number;
		message?: string;
	}

	export interface ParsedPart {
		val: string;
		type: number;
	}

	export type ParsedRoute = ParsedPart[];

	export interface Constants {
		OPTIONS: {
			api: Required<KlasaAPIOptions>;
			pieceDefaults: PieceDefaults & {
				routes: Required<RouteOptions>;
				middlewares: Required<MiddlewareOptions>;
			};
		};
		METHODS_LOWER: string[];
		RESPONSES: {
			FETCHING_TOKEN: string;
			NO_CODE: string;
			UNAUTHORIZED: string;
			NOT_READY: string;
			OK: string;
			UPDATED: [string, string];
		};
	}

//#endregion Types

}

declare module 'discord.js' {
	import { Server, RouteStore, MiddlewareStore } from "klasa-api";

	interface Client {
		server: Server;
		routes: RouteStore;
		middlewares: MiddlewareStore;
	}
}

declare module 'klasa' {
	import { KlasaAPIOptions } from "klasa-api";

	interface KlasaClientOptions {
		api?: KlasaAPIOptions;
	}
}