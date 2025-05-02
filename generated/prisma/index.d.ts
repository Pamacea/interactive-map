
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Verification
 * 
 */
export type Verification = $Result.DefaultSelection<Prisma.$VerificationPayload>
/**
 * Model Map
 * 
 */
export type Map = $Result.DefaultSelection<Prisma.$MapPayload>
/**
 * Model Country
 * 
 */
export type Country = $Result.DefaultSelection<Prisma.$CountryPayload>
/**
 * Model Town
 * 
 */
export type Town = $Result.DefaultSelection<Prisma.$TownPayload>
/**
 * Model Village
 * 
 */
export type Village = $Result.DefaultSelection<Prisma.$VillagePayload>
/**
 * Model PointOfInterest
 * 
 */
export type PointOfInterest = $Result.DefaultSelection<Prisma.$PointOfInterestPayload>
/**
 * Model Population
 * 
 */
export type Population = $Result.DefaultSelection<Prisma.$PopulationPayload>
/**
 * Model Culture
 * 
 */
export type Culture = $Result.DefaultSelection<Prisma.$CulturePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verifications
    * const verifications = await prisma.verification.findMany()
    * ```
    */
  get verification(): Prisma.VerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.map`: Exposes CRUD operations for the **Map** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Maps
    * const maps = await prisma.map.findMany()
    * ```
    */
  get map(): Prisma.MapDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.country`: Exposes CRUD operations for the **Country** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Countries
    * const countries = await prisma.country.findMany()
    * ```
    */
  get country(): Prisma.CountryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.town`: Exposes CRUD operations for the **Town** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Towns
    * const towns = await prisma.town.findMany()
    * ```
    */
  get town(): Prisma.TownDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.village`: Exposes CRUD operations for the **Village** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Villages
    * const villages = await prisma.village.findMany()
    * ```
    */
  get village(): Prisma.VillageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pointOfInterest`: Exposes CRUD operations for the **PointOfInterest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PointOfInterests
    * const pointOfInterests = await prisma.pointOfInterest.findMany()
    * ```
    */
  get pointOfInterest(): Prisma.PointOfInterestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.population`: Exposes CRUD operations for the **Population** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Populations
    * const populations = await prisma.population.findMany()
    * ```
    */
  get population(): Prisma.PopulationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.culture`: Exposes CRUD operations for the **Culture** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cultures
    * const cultures = await prisma.culture.findMany()
    * ```
    */
  get culture(): Prisma.CultureDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Session: 'Session',
    Account: 'Account',
    Verification: 'Verification',
    Map: 'Map',
    Country: 'Country',
    Town: 'Town',
    Village: 'Village',
    PointOfInterest: 'PointOfInterest',
    Population: 'Population',
    Culture: 'Culture'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "session" | "account" | "verification" | "map" | "country" | "town" | "village" | "pointOfInterest" | "population" | "culture"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Verification: {
        payload: Prisma.$VerificationPayload<ExtArgs>
        fields: Prisma.VerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findFirst: {
            args: Prisma.VerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findMany: {
            args: Prisma.VerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          create: {
            args: Prisma.VerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          createMany: {
            args: Prisma.VerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          delete: {
            args: Prisma.VerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          update: {
            args: Prisma.VerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          deleteMany: {
            args: Prisma.VerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          upsert: {
            args: Prisma.VerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerification>
          }
          groupBy: {
            args: Prisma.VerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number
          }
        }
      }
      Map: {
        payload: Prisma.$MapPayload<ExtArgs>
        fields: Prisma.MapFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MapFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MapPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MapFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MapPayload>
          }
          findFirst: {
            args: Prisma.MapFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MapPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MapFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MapPayload>
          }
          findMany: {
            args: Prisma.MapFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MapPayload>[]
          }
          create: {
            args: Prisma.MapCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MapPayload>
          }
          createMany: {
            args: Prisma.MapCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MapCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MapPayload>[]
          }
          delete: {
            args: Prisma.MapDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MapPayload>
          }
          update: {
            args: Prisma.MapUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MapPayload>
          }
          deleteMany: {
            args: Prisma.MapDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MapUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MapUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MapPayload>[]
          }
          upsert: {
            args: Prisma.MapUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MapPayload>
          }
          aggregate: {
            args: Prisma.MapAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMap>
          }
          groupBy: {
            args: Prisma.MapGroupByArgs<ExtArgs>
            result: $Utils.Optional<MapGroupByOutputType>[]
          }
          count: {
            args: Prisma.MapCountArgs<ExtArgs>
            result: $Utils.Optional<MapCountAggregateOutputType> | number
          }
        }
      }
      Country: {
        payload: Prisma.$CountryPayload<ExtArgs>
        fields: Prisma.CountryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CountryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CountryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>
          }
          findFirst: {
            args: Prisma.CountryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CountryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>
          }
          findMany: {
            args: Prisma.CountryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>[]
          }
          create: {
            args: Prisma.CountryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>
          }
          createMany: {
            args: Prisma.CountryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CountryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>[]
          }
          delete: {
            args: Prisma.CountryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>
          }
          update: {
            args: Prisma.CountryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>
          }
          deleteMany: {
            args: Prisma.CountryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CountryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CountryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>[]
          }
          upsert: {
            args: Prisma.CountryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>
          }
          aggregate: {
            args: Prisma.CountryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCountry>
          }
          groupBy: {
            args: Prisma.CountryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CountryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CountryCountArgs<ExtArgs>
            result: $Utils.Optional<CountryCountAggregateOutputType> | number
          }
        }
      }
      Town: {
        payload: Prisma.$TownPayload<ExtArgs>
        fields: Prisma.TownFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TownFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TownPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TownFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TownPayload>
          }
          findFirst: {
            args: Prisma.TownFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TownPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TownFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TownPayload>
          }
          findMany: {
            args: Prisma.TownFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TownPayload>[]
          }
          create: {
            args: Prisma.TownCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TownPayload>
          }
          createMany: {
            args: Prisma.TownCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TownCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TownPayload>[]
          }
          delete: {
            args: Prisma.TownDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TownPayload>
          }
          update: {
            args: Prisma.TownUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TownPayload>
          }
          deleteMany: {
            args: Prisma.TownDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TownUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TownUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TownPayload>[]
          }
          upsert: {
            args: Prisma.TownUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TownPayload>
          }
          aggregate: {
            args: Prisma.TownAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTown>
          }
          groupBy: {
            args: Prisma.TownGroupByArgs<ExtArgs>
            result: $Utils.Optional<TownGroupByOutputType>[]
          }
          count: {
            args: Prisma.TownCountArgs<ExtArgs>
            result: $Utils.Optional<TownCountAggregateOutputType> | number
          }
        }
      }
      Village: {
        payload: Prisma.$VillagePayload<ExtArgs>
        fields: Prisma.VillageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VillageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VillagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VillageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VillagePayload>
          }
          findFirst: {
            args: Prisma.VillageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VillagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VillageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VillagePayload>
          }
          findMany: {
            args: Prisma.VillageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VillagePayload>[]
          }
          create: {
            args: Prisma.VillageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VillagePayload>
          }
          createMany: {
            args: Prisma.VillageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VillageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VillagePayload>[]
          }
          delete: {
            args: Prisma.VillageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VillagePayload>
          }
          update: {
            args: Prisma.VillageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VillagePayload>
          }
          deleteMany: {
            args: Prisma.VillageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VillageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VillageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VillagePayload>[]
          }
          upsert: {
            args: Prisma.VillageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VillagePayload>
          }
          aggregate: {
            args: Prisma.VillageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVillage>
          }
          groupBy: {
            args: Prisma.VillageGroupByArgs<ExtArgs>
            result: $Utils.Optional<VillageGroupByOutputType>[]
          }
          count: {
            args: Prisma.VillageCountArgs<ExtArgs>
            result: $Utils.Optional<VillageCountAggregateOutputType> | number
          }
        }
      }
      PointOfInterest: {
        payload: Prisma.$PointOfInterestPayload<ExtArgs>
        fields: Prisma.PointOfInterestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PointOfInterestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PointOfInterestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PointOfInterestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PointOfInterestPayload>
          }
          findFirst: {
            args: Prisma.PointOfInterestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PointOfInterestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PointOfInterestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PointOfInterestPayload>
          }
          findMany: {
            args: Prisma.PointOfInterestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PointOfInterestPayload>[]
          }
          create: {
            args: Prisma.PointOfInterestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PointOfInterestPayload>
          }
          createMany: {
            args: Prisma.PointOfInterestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PointOfInterestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PointOfInterestPayload>[]
          }
          delete: {
            args: Prisma.PointOfInterestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PointOfInterestPayload>
          }
          update: {
            args: Prisma.PointOfInterestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PointOfInterestPayload>
          }
          deleteMany: {
            args: Prisma.PointOfInterestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PointOfInterestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PointOfInterestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PointOfInterestPayload>[]
          }
          upsert: {
            args: Prisma.PointOfInterestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PointOfInterestPayload>
          }
          aggregate: {
            args: Prisma.PointOfInterestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePointOfInterest>
          }
          groupBy: {
            args: Prisma.PointOfInterestGroupByArgs<ExtArgs>
            result: $Utils.Optional<PointOfInterestGroupByOutputType>[]
          }
          count: {
            args: Prisma.PointOfInterestCountArgs<ExtArgs>
            result: $Utils.Optional<PointOfInterestCountAggregateOutputType> | number
          }
        }
      }
      Population: {
        payload: Prisma.$PopulationPayload<ExtArgs>
        fields: Prisma.PopulationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PopulationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PopulationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PopulationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PopulationPayload>
          }
          findFirst: {
            args: Prisma.PopulationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PopulationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PopulationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PopulationPayload>
          }
          findMany: {
            args: Prisma.PopulationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PopulationPayload>[]
          }
          create: {
            args: Prisma.PopulationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PopulationPayload>
          }
          createMany: {
            args: Prisma.PopulationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PopulationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PopulationPayload>[]
          }
          delete: {
            args: Prisma.PopulationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PopulationPayload>
          }
          update: {
            args: Prisma.PopulationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PopulationPayload>
          }
          deleteMany: {
            args: Prisma.PopulationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PopulationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PopulationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PopulationPayload>[]
          }
          upsert: {
            args: Prisma.PopulationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PopulationPayload>
          }
          aggregate: {
            args: Prisma.PopulationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePopulation>
          }
          groupBy: {
            args: Prisma.PopulationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PopulationGroupByOutputType>[]
          }
          count: {
            args: Prisma.PopulationCountArgs<ExtArgs>
            result: $Utils.Optional<PopulationCountAggregateOutputType> | number
          }
        }
      }
      Culture: {
        payload: Prisma.$CulturePayload<ExtArgs>
        fields: Prisma.CultureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CultureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CulturePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CultureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CulturePayload>
          }
          findFirst: {
            args: Prisma.CultureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CulturePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CultureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CulturePayload>
          }
          findMany: {
            args: Prisma.CultureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CulturePayload>[]
          }
          create: {
            args: Prisma.CultureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CulturePayload>
          }
          createMany: {
            args: Prisma.CultureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CultureCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CulturePayload>[]
          }
          delete: {
            args: Prisma.CultureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CulturePayload>
          }
          update: {
            args: Prisma.CultureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CulturePayload>
          }
          deleteMany: {
            args: Prisma.CultureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CultureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CultureUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CulturePayload>[]
          }
          upsert: {
            args: Prisma.CultureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CulturePayload>
          }
          aggregate: {
            args: Prisma.CultureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCulture>
          }
          groupBy: {
            args: Prisma.CultureGroupByArgs<ExtArgs>
            result: $Utils.Optional<CultureGroupByOutputType>[]
          }
          count: {
            args: Prisma.CultureCountArgs<ExtArgs>
            result: $Utils.Optional<CultureCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    session?: SessionOmit
    account?: AccountOmit
    verification?: VerificationOmit
    map?: MapOmit
    country?: CountryOmit
    town?: TownOmit
    village?: VillageOmit
    pointOfInterest?: PointOfInterestOmit
    population?: PopulationOmit
    culture?: CultureOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    accounts: number
    maps: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    maps?: boolean | UserCountOutputTypeCountMapsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MapWhereInput
  }


  /**
   * Count Type MapCountOutputType
   */

  export type MapCountOutputType = {
    countries: number
    towns: number
    villages: number
    poi: number
    population: number
    culture: number
  }

  export type MapCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    countries?: boolean | MapCountOutputTypeCountCountriesArgs
    towns?: boolean | MapCountOutputTypeCountTownsArgs
    villages?: boolean | MapCountOutputTypeCountVillagesArgs
    poi?: boolean | MapCountOutputTypeCountPoiArgs
    population?: boolean | MapCountOutputTypeCountPopulationArgs
    culture?: boolean | MapCountOutputTypeCountCultureArgs
  }

  // Custom InputTypes
  /**
   * MapCountOutputType without action
   */
  export type MapCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapCountOutputType
     */
    select?: MapCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MapCountOutputType without action
   */
  export type MapCountOutputTypeCountCountriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CountryWhereInput
  }

  /**
   * MapCountOutputType without action
   */
  export type MapCountOutputTypeCountTownsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TownWhereInput
  }

  /**
   * MapCountOutputType without action
   */
  export type MapCountOutputTypeCountVillagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VillageWhereInput
  }

  /**
   * MapCountOutputType without action
   */
  export type MapCountOutputTypeCountPoiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PointOfInterestWhereInput
  }

  /**
   * MapCountOutputType without action
   */
  export type MapCountOutputTypeCountPopulationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PopulationWhereInput
  }

  /**
   * MapCountOutputType without action
   */
  export type MapCountOutputTypeCountCultureArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CultureWhereInput
  }


  /**
   * Count Type TownCountOutputType
   */

  export type TownCountOutputType = {
    poi: number
  }

  export type TownCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    poi?: boolean | TownCountOutputTypeCountPoiArgs
  }

  // Custom InputTypes
  /**
   * TownCountOutputType without action
   */
  export type TownCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TownCountOutputType
     */
    select?: TownCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TownCountOutputType without action
   */
  export type TownCountOutputTypeCountPoiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PointOfInterestWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
    username: string | null
    displayUsername: string | null
    isAnonymous: boolean | null
    role: string | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
    username: string | null
    displayUsername: string | null
    isAnonymous: boolean | null
    role: string | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    createdAt: number
    updatedAt: number
    username: number
    displayUsername: number
    isAnonymous: number
    role: number
    banned: number
    banReason: number
    banExpires: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    username?: true
    displayUsername?: true
    isAnonymous?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    username?: true
    displayUsername?: true
    isAnonymous?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    username?: true
    displayUsername?: true
    isAnonymous?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    createdAt: Date
    updatedAt: Date
    username: string | null
    displayUsername: string | null
    isAnonymous: boolean | null
    role: string | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    username?: boolean
    displayUsername?: boolean
    isAnonymous?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    maps?: boolean | User$mapsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    username?: boolean
    displayUsername?: boolean
    isAnonymous?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    username?: boolean
    displayUsername?: boolean
    isAnonymous?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    username?: boolean
    displayUsername?: boolean
    isAnonymous?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "createdAt" | "updatedAt" | "username" | "displayUsername" | "isAnonymous" | "role" | "banned" | "banReason" | "banExpires", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    maps?: boolean | User$mapsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      maps: Prisma.$MapPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      emailVerified: boolean
      image: string | null
      createdAt: Date
      updatedAt: Date
      username: string | null
      displayUsername: string | null
      isAnonymous: boolean | null
      role: string | null
      banned: boolean | null
      banReason: string | null
      banExpires: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    maps<T extends User$mapsArgs<ExtArgs> = {}>(args?: Subset<T, User$mapsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly image: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly username: FieldRef<"User", 'String'>
    readonly displayUsername: FieldRef<"User", 'String'>
    readonly isAnonymous: FieldRef<"User", 'Boolean'>
    readonly role: FieldRef<"User", 'String'>
    readonly banned: FieldRef<"User", 'Boolean'>
    readonly banReason: FieldRef<"User", 'String'>
    readonly banExpires: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.maps
   */
  export type User$mapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapInclude<ExtArgs> | null
    where?: MapWhereInput
    orderBy?: MapOrderByWithRelationInput | MapOrderByWithRelationInput[]
    cursor?: MapWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MapScalarFieldEnum | MapScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
    impersonatedBy: string | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
    impersonatedBy: string | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    expiresAt: number
    token: number
    createdAt: number
    updatedAt: number
    ipAddress: number
    userAgent: number
    userId: number
    impersonatedBy: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    impersonatedBy?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    impersonatedBy?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    impersonatedBy?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    expiresAt: Date
    token: string
    createdAt: Date
    updatedAt: Date
    ipAddress: string | null
    userAgent: string | null
    userId: string
    impersonatedBy: string | null
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    impersonatedBy?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    impersonatedBy?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    impersonatedBy?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    impersonatedBy?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "expiresAt" | "token" | "createdAt" | "updatedAt" | "ipAddress" | "userAgent" | "userId" | "impersonatedBy", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      expiresAt: Date
      token: string
      createdAt: Date
      updatedAt: Date
      ipAddress: string | null
      userAgent: string | null
      userId: string
      impersonatedBy: string | null
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly token: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly impersonatedBy: FieldRef<"Session", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    accountId: number
    providerId: number
    userId: number
    accessToken: number
    refreshToken: number
    idToken: number
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
    scope: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "providerId" | "userId" | "accessToken" | "refreshToken" | "idToken" | "accessTokenExpiresAt" | "refreshTokenExpiresAt" | "scope" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      providerId: string
      userId: string
      accessToken: string | null
      refreshToken: string | null
      idToken: string | null
      accessTokenExpiresAt: Date | null
      refreshTokenExpiresAt: Date | null
      scope: string | null
      password: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly accountId: FieldRef<"Account", 'String'>
    readonly providerId: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly accessTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly refreshTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  export type VerificationMinAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationMaxAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationCountAggregateOutputType = {
    id: number
    identifier: number
    value: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VerificationMinAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationMaxAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationCountAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verification to aggregate.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Verifications
    **/
    _count?: true | VerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationMaxAggregateInputType
  }

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>
  }




  export type VerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationWhereInput
    orderBy?: VerificationOrderByWithAggregationInput | VerificationOrderByWithAggregationInput[]
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum
    having?: VerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCountAggregateInputType | true
    _min?: VerificationMinAggregateInputType
    _max?: VerificationMaxAggregateInputType
  }

  export type VerificationGroupByOutputType = {
    id: string
    identifier: string
    value: string
    expiresAt: Date
    createdAt: Date | null
    updatedAt: Date | null
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  type GetVerificationGroupByPayload<T extends VerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
        }
      >
    >


  export type VerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectScalar = {
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "identifier" | "value" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["verification"]>

  export type $VerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Verification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      identifier: string
      value: string
      expiresAt: Date
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["verification"]>
    composites: {}
  }

  type VerificationGetPayload<S extends boolean | null | undefined | VerificationDefaultArgs> = $Result.GetResult<Prisma.$VerificationPayload, S>

  type VerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationCountAggregateInputType | true
    }

  export interface VerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Verification'], meta: { name: 'Verification' } }
    /**
     * Find zero or one Verification that matches the filter.
     * @param {VerificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationFindUniqueArgs>(args: SelectSubset<T, VerificationFindUniqueArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationFindFirstArgs>(args?: SelectSubset<T, VerificationFindFirstArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     * 
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationFindManyArgs>(args?: SelectSubset<T, VerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Verification.
     * @param {VerificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     * 
     */
    create<T extends VerificationCreateArgs>(args: SelectSubset<T, VerificationCreateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Verifications.
     * @param {VerificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationCreateManyArgs>(args?: SelectSubset<T, VerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Verifications and returns the data saved in the database.
     * @param {VerificationCreateManyAndReturnArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Verification.
     * @param {VerificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     * 
     */
    delete<T extends VerificationDeleteArgs>(args: SelectSubset<T, VerificationDeleteArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Verification.
     * @param {VerificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationUpdateArgs>(args: SelectSubset<T, VerificationUpdateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Verifications.
     * @param {VerificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationDeleteManyArgs>(args?: SelectSubset<T, VerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationUpdateManyArgs>(args: SelectSubset<T, VerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications and returns the data updated in the database.
     * @param {VerificationUpdateManyAndReturnArgs} args - Arguments to update many Verifications.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Verification.
     * @param {VerificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends VerificationUpsertArgs>(args: SelectSubset<T, VerificationUpsertArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
    **/
    count<T extends VerificationCountArgs>(
      args?: Subset<T, VerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationAggregateArgs>(args: Subset<T, VerificationAggregateArgs>): Prisma.PrismaPromise<GetVerificationAggregateType<T>>

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationGroupByArgs['orderBy'] }
        : { orderBy?: VerificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Verification model
   */
  readonly fields: VerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Verification model
   */
  interface VerificationFieldRefs {
    readonly id: FieldRef<"Verification", 'String'>
    readonly identifier: FieldRef<"Verification", 'String'>
    readonly value: FieldRef<"Verification", 'String'>
    readonly expiresAt: FieldRef<"Verification", 'DateTime'>
    readonly createdAt: FieldRef<"Verification", 'DateTime'>
    readonly updatedAt: FieldRef<"Verification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Verification findUnique
   */
  export type VerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findUniqueOrThrow
   */
  export type VerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findFirst
   */
  export type VerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findFirstOrThrow
   */
  export type VerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findMany
   */
  export type VerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verifications to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification create
   */
  export type VerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Verification.
     */
    data: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
  }

  /**
   * Verification createMany
   */
  export type VerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification createManyAndReturn
   */
  export type VerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification update
   */
  export type VerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Verification.
     */
    data: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
    /**
     * Choose, which Verification to update.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification updateMany
   */
  export type VerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification updateManyAndReturn
   */
  export type VerificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification upsert
   */
  export type VerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Verification to update in case it exists.
     */
    where: VerificationWhereUniqueInput
    /**
     * In case the Verification found by the `where` argument doesn't exist, create a new Verification with this data.
     */
    create: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
    /**
     * In case the Verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
  }

  /**
   * Verification delete
   */
  export type VerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter which Verification to delete.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification deleteMany
   */
  export type VerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verifications to delete
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to delete.
     */
    limit?: number
  }

  /**
   * Verification without action
   */
  export type VerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
  }


  /**
   * Model Map
   */

  export type AggregateMap = {
    _count: MapCountAggregateOutputType | null
    _min: MapMinAggregateOutputType | null
    _max: MapMaxAggregateOutputType | null
  }

  export type MapMinAggregateOutputType = {
    id: string | null
    name: string | null
    url: string | null
    description: string | null
    owner: string | null
    createdAt: Date | null
    updateAt: Date | null
  }

  export type MapMaxAggregateOutputType = {
    id: string | null
    name: string | null
    url: string | null
    description: string | null
    owner: string | null
    createdAt: Date | null
    updateAt: Date | null
  }

  export type MapCountAggregateOutputType = {
    id: number
    name: number
    url: number
    description: number
    owner: number
    createdAt: number
    updateAt: number
    _all: number
  }


  export type MapMinAggregateInputType = {
    id?: true
    name?: true
    url?: true
    description?: true
    owner?: true
    createdAt?: true
    updateAt?: true
  }

  export type MapMaxAggregateInputType = {
    id?: true
    name?: true
    url?: true
    description?: true
    owner?: true
    createdAt?: true
    updateAt?: true
  }

  export type MapCountAggregateInputType = {
    id?: true
    name?: true
    url?: true
    description?: true
    owner?: true
    createdAt?: true
    updateAt?: true
    _all?: true
  }

  export type MapAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Map to aggregate.
     */
    where?: MapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Maps to fetch.
     */
    orderBy?: MapOrderByWithRelationInput | MapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Maps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Maps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Maps
    **/
    _count?: true | MapCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MapMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MapMaxAggregateInputType
  }

  export type GetMapAggregateType<T extends MapAggregateArgs> = {
        [P in keyof T & keyof AggregateMap]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMap[P]>
      : GetScalarType<T[P], AggregateMap[P]>
  }




  export type MapGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MapWhereInput
    orderBy?: MapOrderByWithAggregationInput | MapOrderByWithAggregationInput[]
    by: MapScalarFieldEnum[] | MapScalarFieldEnum
    having?: MapScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MapCountAggregateInputType | true
    _min?: MapMinAggregateInputType
    _max?: MapMaxAggregateInputType
  }

  export type MapGroupByOutputType = {
    id: string
    name: string
    url: string
    description: string | null
    owner: string
    createdAt: Date | null
    updateAt: Date | null
    _count: MapCountAggregateOutputType | null
    _min: MapMinAggregateOutputType | null
    _max: MapMaxAggregateOutputType | null
  }

  type GetMapGroupByPayload<T extends MapGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MapGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MapGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MapGroupByOutputType[P]>
            : GetScalarType<T[P], MapGroupByOutputType[P]>
        }
      >
    >


  export type MapSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    description?: boolean
    owner?: boolean
    createdAt?: boolean
    updateAt?: boolean
    countries?: boolean | Map$countriesArgs<ExtArgs>
    towns?: boolean | Map$townsArgs<ExtArgs>
    villages?: boolean | Map$villagesArgs<ExtArgs>
    poi?: boolean | Map$poiArgs<ExtArgs>
    population?: boolean | Map$populationArgs<ExtArgs>
    culture?: boolean | Map$cultureArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | MapCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["map"]>

  export type MapSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    description?: boolean
    owner?: boolean
    createdAt?: boolean
    updateAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["map"]>

  export type MapSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    description?: boolean
    owner?: boolean
    createdAt?: boolean
    updateAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["map"]>

  export type MapSelectScalar = {
    id?: boolean
    name?: boolean
    url?: boolean
    description?: boolean
    owner?: boolean
    createdAt?: boolean
    updateAt?: boolean
  }

  export type MapOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "url" | "description" | "owner" | "createdAt" | "updateAt", ExtArgs["result"]["map"]>
  export type MapInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    countries?: boolean | Map$countriesArgs<ExtArgs>
    towns?: boolean | Map$townsArgs<ExtArgs>
    villages?: boolean | Map$villagesArgs<ExtArgs>
    poi?: boolean | Map$poiArgs<ExtArgs>
    population?: boolean | Map$populationArgs<ExtArgs>
    culture?: boolean | Map$cultureArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | MapCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MapIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MapIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MapPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Map"
    objects: {
      countries: Prisma.$CountryPayload<ExtArgs>[]
      towns: Prisma.$TownPayload<ExtArgs>[]
      villages: Prisma.$VillagePayload<ExtArgs>[]
      poi: Prisma.$PointOfInterestPayload<ExtArgs>[]
      population: Prisma.$PopulationPayload<ExtArgs>[]
      culture: Prisma.$CulturePayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      url: string
      description: string | null
      owner: string
      createdAt: Date | null
      updateAt: Date | null
    }, ExtArgs["result"]["map"]>
    composites: {}
  }

  type MapGetPayload<S extends boolean | null | undefined | MapDefaultArgs> = $Result.GetResult<Prisma.$MapPayload, S>

  type MapCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MapCountAggregateInputType | true
    }

  export interface MapDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Map'], meta: { name: 'Map' } }
    /**
     * Find zero or one Map that matches the filter.
     * @param {MapFindUniqueArgs} args - Arguments to find a Map
     * @example
     * // Get one Map
     * const map = await prisma.map.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MapFindUniqueArgs>(args: SelectSubset<T, MapFindUniqueArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Map that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MapFindUniqueOrThrowArgs} args - Arguments to find a Map
     * @example
     * // Get one Map
     * const map = await prisma.map.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MapFindUniqueOrThrowArgs>(args: SelectSubset<T, MapFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Map that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapFindFirstArgs} args - Arguments to find a Map
     * @example
     * // Get one Map
     * const map = await prisma.map.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MapFindFirstArgs>(args?: SelectSubset<T, MapFindFirstArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Map that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapFindFirstOrThrowArgs} args - Arguments to find a Map
     * @example
     * // Get one Map
     * const map = await prisma.map.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MapFindFirstOrThrowArgs>(args?: SelectSubset<T, MapFindFirstOrThrowArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Maps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Maps
     * const maps = await prisma.map.findMany()
     * 
     * // Get first 10 Maps
     * const maps = await prisma.map.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mapWithIdOnly = await prisma.map.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MapFindManyArgs>(args?: SelectSubset<T, MapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Map.
     * @param {MapCreateArgs} args - Arguments to create a Map.
     * @example
     * // Create one Map
     * const Map = await prisma.map.create({
     *   data: {
     *     // ... data to create a Map
     *   }
     * })
     * 
     */
    create<T extends MapCreateArgs>(args: SelectSubset<T, MapCreateArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Maps.
     * @param {MapCreateManyArgs} args - Arguments to create many Maps.
     * @example
     * // Create many Maps
     * const map = await prisma.map.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MapCreateManyArgs>(args?: SelectSubset<T, MapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Maps and returns the data saved in the database.
     * @param {MapCreateManyAndReturnArgs} args - Arguments to create many Maps.
     * @example
     * // Create many Maps
     * const map = await prisma.map.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Maps and only return the `id`
     * const mapWithIdOnly = await prisma.map.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MapCreateManyAndReturnArgs>(args?: SelectSubset<T, MapCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Map.
     * @param {MapDeleteArgs} args - Arguments to delete one Map.
     * @example
     * // Delete one Map
     * const Map = await prisma.map.delete({
     *   where: {
     *     // ... filter to delete one Map
     *   }
     * })
     * 
     */
    delete<T extends MapDeleteArgs>(args: SelectSubset<T, MapDeleteArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Map.
     * @param {MapUpdateArgs} args - Arguments to update one Map.
     * @example
     * // Update one Map
     * const map = await prisma.map.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MapUpdateArgs>(args: SelectSubset<T, MapUpdateArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Maps.
     * @param {MapDeleteManyArgs} args - Arguments to filter Maps to delete.
     * @example
     * // Delete a few Maps
     * const { count } = await prisma.map.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MapDeleteManyArgs>(args?: SelectSubset<T, MapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Maps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Maps
     * const map = await prisma.map.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MapUpdateManyArgs>(args: SelectSubset<T, MapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Maps and returns the data updated in the database.
     * @param {MapUpdateManyAndReturnArgs} args - Arguments to update many Maps.
     * @example
     * // Update many Maps
     * const map = await prisma.map.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Maps and only return the `id`
     * const mapWithIdOnly = await prisma.map.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MapUpdateManyAndReturnArgs>(args: SelectSubset<T, MapUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Map.
     * @param {MapUpsertArgs} args - Arguments to update or create a Map.
     * @example
     * // Update or create a Map
     * const map = await prisma.map.upsert({
     *   create: {
     *     // ... data to create a Map
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Map we want to update
     *   }
     * })
     */
    upsert<T extends MapUpsertArgs>(args: SelectSubset<T, MapUpsertArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Maps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapCountArgs} args - Arguments to filter Maps to count.
     * @example
     * // Count the number of Maps
     * const count = await prisma.map.count({
     *   where: {
     *     // ... the filter for the Maps we want to count
     *   }
     * })
    **/
    count<T extends MapCountArgs>(
      args?: Subset<T, MapCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MapCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Map.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MapAggregateArgs>(args: Subset<T, MapAggregateArgs>): Prisma.PrismaPromise<GetMapAggregateType<T>>

    /**
     * Group by Map.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MapGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MapGroupByArgs['orderBy'] }
        : { orderBy?: MapGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Map model
   */
  readonly fields: MapFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Map.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MapClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    countries<T extends Map$countriesArgs<ExtArgs> = {}>(args?: Subset<T, Map$countriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    towns<T extends Map$townsArgs<ExtArgs> = {}>(args?: Subset<T, Map$townsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    villages<T extends Map$villagesArgs<ExtArgs> = {}>(args?: Subset<T, Map$villagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VillagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    poi<T extends Map$poiArgs<ExtArgs> = {}>(args?: Subset<T, Map$poiArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    population<T extends Map$populationArgs<ExtArgs> = {}>(args?: Subset<T, Map$populationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PopulationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    culture<T extends Map$cultureArgs<ExtArgs> = {}>(args?: Subset<T, Map$cultureArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CulturePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Map model
   */
  interface MapFieldRefs {
    readonly id: FieldRef<"Map", 'String'>
    readonly name: FieldRef<"Map", 'String'>
    readonly url: FieldRef<"Map", 'String'>
    readonly description: FieldRef<"Map", 'String'>
    readonly owner: FieldRef<"Map", 'String'>
    readonly createdAt: FieldRef<"Map", 'DateTime'>
    readonly updateAt: FieldRef<"Map", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Map findUnique
   */
  export type MapFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapInclude<ExtArgs> | null
    /**
     * Filter, which Map to fetch.
     */
    where: MapWhereUniqueInput
  }

  /**
   * Map findUniqueOrThrow
   */
  export type MapFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapInclude<ExtArgs> | null
    /**
     * Filter, which Map to fetch.
     */
    where: MapWhereUniqueInput
  }

  /**
   * Map findFirst
   */
  export type MapFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapInclude<ExtArgs> | null
    /**
     * Filter, which Map to fetch.
     */
    where?: MapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Maps to fetch.
     */
    orderBy?: MapOrderByWithRelationInput | MapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Maps.
     */
    cursor?: MapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Maps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Maps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Maps.
     */
    distinct?: MapScalarFieldEnum | MapScalarFieldEnum[]
  }

  /**
   * Map findFirstOrThrow
   */
  export type MapFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapInclude<ExtArgs> | null
    /**
     * Filter, which Map to fetch.
     */
    where?: MapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Maps to fetch.
     */
    orderBy?: MapOrderByWithRelationInput | MapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Maps.
     */
    cursor?: MapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Maps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Maps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Maps.
     */
    distinct?: MapScalarFieldEnum | MapScalarFieldEnum[]
  }

  /**
   * Map findMany
   */
  export type MapFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapInclude<ExtArgs> | null
    /**
     * Filter, which Maps to fetch.
     */
    where?: MapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Maps to fetch.
     */
    orderBy?: MapOrderByWithRelationInput | MapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Maps.
     */
    cursor?: MapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Maps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Maps.
     */
    skip?: number
    distinct?: MapScalarFieldEnum | MapScalarFieldEnum[]
  }

  /**
   * Map create
   */
  export type MapCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapInclude<ExtArgs> | null
    /**
     * The data needed to create a Map.
     */
    data: XOR<MapCreateInput, MapUncheckedCreateInput>
  }

  /**
   * Map createMany
   */
  export type MapCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Maps.
     */
    data: MapCreateManyInput | MapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Map createManyAndReturn
   */
  export type MapCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * The data used to create many Maps.
     */
    data: MapCreateManyInput | MapCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Map update
   */
  export type MapUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapInclude<ExtArgs> | null
    /**
     * The data needed to update a Map.
     */
    data: XOR<MapUpdateInput, MapUncheckedUpdateInput>
    /**
     * Choose, which Map to update.
     */
    where: MapWhereUniqueInput
  }

  /**
   * Map updateMany
   */
  export type MapUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Maps.
     */
    data: XOR<MapUpdateManyMutationInput, MapUncheckedUpdateManyInput>
    /**
     * Filter which Maps to update
     */
    where?: MapWhereInput
    /**
     * Limit how many Maps to update.
     */
    limit?: number
  }

  /**
   * Map updateManyAndReturn
   */
  export type MapUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * The data used to update Maps.
     */
    data: XOR<MapUpdateManyMutationInput, MapUncheckedUpdateManyInput>
    /**
     * Filter which Maps to update
     */
    where?: MapWhereInput
    /**
     * Limit how many Maps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Map upsert
   */
  export type MapUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapInclude<ExtArgs> | null
    /**
     * The filter to search for the Map to update in case it exists.
     */
    where: MapWhereUniqueInput
    /**
     * In case the Map found by the `where` argument doesn't exist, create a new Map with this data.
     */
    create: XOR<MapCreateInput, MapUncheckedCreateInput>
    /**
     * In case the Map was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MapUpdateInput, MapUncheckedUpdateInput>
  }

  /**
   * Map delete
   */
  export type MapDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapInclude<ExtArgs> | null
    /**
     * Filter which Map to delete.
     */
    where: MapWhereUniqueInput
  }

  /**
   * Map deleteMany
   */
  export type MapDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Maps to delete
     */
    where?: MapWhereInput
    /**
     * Limit how many Maps to delete.
     */
    limit?: number
  }

  /**
   * Map.countries
   */
  export type Map$countriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    where?: CountryWhereInput
    orderBy?: CountryOrderByWithRelationInput | CountryOrderByWithRelationInput[]
    cursor?: CountryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CountryScalarFieldEnum | CountryScalarFieldEnum[]
  }

  /**
   * Map.towns
   */
  export type Map$townsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownInclude<ExtArgs> | null
    where?: TownWhereInput
    orderBy?: TownOrderByWithRelationInput | TownOrderByWithRelationInput[]
    cursor?: TownWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TownScalarFieldEnum | TownScalarFieldEnum[]
  }

  /**
   * Map.villages
   */
  export type Map$villagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageInclude<ExtArgs> | null
    where?: VillageWhereInput
    orderBy?: VillageOrderByWithRelationInput | VillageOrderByWithRelationInput[]
    cursor?: VillageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VillageScalarFieldEnum | VillageScalarFieldEnum[]
  }

  /**
   * Map.poi
   */
  export type Map$poiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestInclude<ExtArgs> | null
    where?: PointOfInterestWhereInput
    orderBy?: PointOfInterestOrderByWithRelationInput | PointOfInterestOrderByWithRelationInput[]
    cursor?: PointOfInterestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PointOfInterestScalarFieldEnum | PointOfInterestScalarFieldEnum[]
  }

  /**
   * Map.population
   */
  export type Map$populationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationInclude<ExtArgs> | null
    where?: PopulationWhereInput
    orderBy?: PopulationOrderByWithRelationInput | PopulationOrderByWithRelationInput[]
    cursor?: PopulationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PopulationScalarFieldEnum | PopulationScalarFieldEnum[]
  }

  /**
   * Map.culture
   */
  export type Map$cultureArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureInclude<ExtArgs> | null
    where?: CultureWhereInput
    orderBy?: CultureOrderByWithRelationInput | CultureOrderByWithRelationInput[]
    cursor?: CultureWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CultureScalarFieldEnum | CultureScalarFieldEnum[]
  }

  /**
   * Map without action
   */
  export type MapDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Map
     */
    select?: MapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Map
     */
    omit?: MapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MapInclude<ExtArgs> | null
  }


  /**
   * Model Country
   */

  export type AggregateCountry = {
    _count: CountryCountAggregateOutputType | null
    _min: CountryMinAggregateOutputType | null
    _max: CountryMaxAggregateOutputType | null
  }

  export type CountryMinAggregateOutputType = {
    id: string | null
    name: string | null
    area: string | null
    description: string | null
    map: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CountryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    area: string | null
    description: string | null
    map: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CountryCountAggregateOutputType = {
    id: number
    name: number
    area: number
    description: number
    map: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CountryMinAggregateInputType = {
    id?: true
    name?: true
    area?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CountryMaxAggregateInputType = {
    id?: true
    name?: true
    area?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CountryCountAggregateInputType = {
    id?: true
    name?: true
    area?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CountryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Country to aggregate.
     */
    where?: CountryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Countries to fetch.
     */
    orderBy?: CountryOrderByWithRelationInput | CountryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CountryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Countries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Countries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Countries
    **/
    _count?: true | CountryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CountryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CountryMaxAggregateInputType
  }

  export type GetCountryAggregateType<T extends CountryAggregateArgs> = {
        [P in keyof T & keyof AggregateCountry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCountry[P]>
      : GetScalarType<T[P], AggregateCountry[P]>
  }




  export type CountryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CountryWhereInput
    orderBy?: CountryOrderByWithAggregationInput | CountryOrderByWithAggregationInput[]
    by: CountryScalarFieldEnum[] | CountryScalarFieldEnum
    having?: CountryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CountryCountAggregateInputType | true
    _min?: CountryMinAggregateInputType
    _max?: CountryMaxAggregateInputType
  }

  export type CountryGroupByOutputType = {
    id: string
    name: string
    area: string
    description: string | null
    map: string
    createdAt: Date | null
    updatedAt: Date | null
    _count: CountryCountAggregateOutputType | null
    _min: CountryMinAggregateOutputType | null
    _max: CountryMaxAggregateOutputType | null
  }

  type GetCountryGroupByPayload<T extends CountryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CountryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CountryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CountryGroupByOutputType[P]>
            : GetScalarType<T[P], CountryGroupByOutputType[P]>
        }
      >
    >


  export type CountrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    area?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["country"]>

  export type CountrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    area?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["country"]>

  export type CountrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    area?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["country"]>

  export type CountrySelectScalar = {
    id?: boolean
    name?: boolean
    area?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CountryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "area" | "description" | "map" | "createdAt" | "updatedAt", ExtArgs["result"]["country"]>
  export type CountryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }
  export type CountryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }
  export type CountryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }

  export type $CountryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Country"
    objects: {
      maps: Prisma.$MapPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      area: string
      description: string | null
      map: string
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["country"]>
    composites: {}
  }

  type CountryGetPayload<S extends boolean | null | undefined | CountryDefaultArgs> = $Result.GetResult<Prisma.$CountryPayload, S>

  type CountryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CountryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CountryCountAggregateInputType | true
    }

  export interface CountryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Country'], meta: { name: 'Country' } }
    /**
     * Find zero or one Country that matches the filter.
     * @param {CountryFindUniqueArgs} args - Arguments to find a Country
     * @example
     * // Get one Country
     * const country = await prisma.country.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CountryFindUniqueArgs>(args: SelectSubset<T, CountryFindUniqueArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Country that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CountryFindUniqueOrThrowArgs} args - Arguments to find a Country
     * @example
     * // Get one Country
     * const country = await prisma.country.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CountryFindUniqueOrThrowArgs>(args: SelectSubset<T, CountryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Country that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryFindFirstArgs} args - Arguments to find a Country
     * @example
     * // Get one Country
     * const country = await prisma.country.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CountryFindFirstArgs>(args?: SelectSubset<T, CountryFindFirstArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Country that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryFindFirstOrThrowArgs} args - Arguments to find a Country
     * @example
     * // Get one Country
     * const country = await prisma.country.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CountryFindFirstOrThrowArgs>(args?: SelectSubset<T, CountryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Countries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Countries
     * const countries = await prisma.country.findMany()
     * 
     * // Get first 10 Countries
     * const countries = await prisma.country.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const countryWithIdOnly = await prisma.country.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CountryFindManyArgs>(args?: SelectSubset<T, CountryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Country.
     * @param {CountryCreateArgs} args - Arguments to create a Country.
     * @example
     * // Create one Country
     * const Country = await prisma.country.create({
     *   data: {
     *     // ... data to create a Country
     *   }
     * })
     * 
     */
    create<T extends CountryCreateArgs>(args: SelectSubset<T, CountryCreateArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Countries.
     * @param {CountryCreateManyArgs} args - Arguments to create many Countries.
     * @example
     * // Create many Countries
     * const country = await prisma.country.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CountryCreateManyArgs>(args?: SelectSubset<T, CountryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Countries and returns the data saved in the database.
     * @param {CountryCreateManyAndReturnArgs} args - Arguments to create many Countries.
     * @example
     * // Create many Countries
     * const country = await prisma.country.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Countries and only return the `id`
     * const countryWithIdOnly = await prisma.country.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CountryCreateManyAndReturnArgs>(args?: SelectSubset<T, CountryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Country.
     * @param {CountryDeleteArgs} args - Arguments to delete one Country.
     * @example
     * // Delete one Country
     * const Country = await prisma.country.delete({
     *   where: {
     *     // ... filter to delete one Country
     *   }
     * })
     * 
     */
    delete<T extends CountryDeleteArgs>(args: SelectSubset<T, CountryDeleteArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Country.
     * @param {CountryUpdateArgs} args - Arguments to update one Country.
     * @example
     * // Update one Country
     * const country = await prisma.country.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CountryUpdateArgs>(args: SelectSubset<T, CountryUpdateArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Countries.
     * @param {CountryDeleteManyArgs} args - Arguments to filter Countries to delete.
     * @example
     * // Delete a few Countries
     * const { count } = await prisma.country.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CountryDeleteManyArgs>(args?: SelectSubset<T, CountryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Countries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Countries
     * const country = await prisma.country.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CountryUpdateManyArgs>(args: SelectSubset<T, CountryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Countries and returns the data updated in the database.
     * @param {CountryUpdateManyAndReturnArgs} args - Arguments to update many Countries.
     * @example
     * // Update many Countries
     * const country = await prisma.country.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Countries and only return the `id`
     * const countryWithIdOnly = await prisma.country.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CountryUpdateManyAndReturnArgs>(args: SelectSubset<T, CountryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Country.
     * @param {CountryUpsertArgs} args - Arguments to update or create a Country.
     * @example
     * // Update or create a Country
     * const country = await prisma.country.upsert({
     *   create: {
     *     // ... data to create a Country
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Country we want to update
     *   }
     * })
     */
    upsert<T extends CountryUpsertArgs>(args: SelectSubset<T, CountryUpsertArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Countries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryCountArgs} args - Arguments to filter Countries to count.
     * @example
     * // Count the number of Countries
     * const count = await prisma.country.count({
     *   where: {
     *     // ... the filter for the Countries we want to count
     *   }
     * })
    **/
    count<T extends CountryCountArgs>(
      args?: Subset<T, CountryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CountryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Country.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CountryAggregateArgs>(args: Subset<T, CountryAggregateArgs>): Prisma.PrismaPromise<GetCountryAggregateType<T>>

    /**
     * Group by Country.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CountryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CountryGroupByArgs['orderBy'] }
        : { orderBy?: CountryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CountryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCountryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Country model
   */
  readonly fields: CountryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Country.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CountryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    maps<T extends MapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MapDefaultArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Country model
   */
  interface CountryFieldRefs {
    readonly id: FieldRef<"Country", 'String'>
    readonly name: FieldRef<"Country", 'String'>
    readonly area: FieldRef<"Country", 'String'>
    readonly description: FieldRef<"Country", 'String'>
    readonly map: FieldRef<"Country", 'String'>
    readonly createdAt: FieldRef<"Country", 'DateTime'>
    readonly updatedAt: FieldRef<"Country", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Country findUnique
   */
  export type CountryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * Filter, which Country to fetch.
     */
    where: CountryWhereUniqueInput
  }

  /**
   * Country findUniqueOrThrow
   */
  export type CountryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * Filter, which Country to fetch.
     */
    where: CountryWhereUniqueInput
  }

  /**
   * Country findFirst
   */
  export type CountryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * Filter, which Country to fetch.
     */
    where?: CountryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Countries to fetch.
     */
    orderBy?: CountryOrderByWithRelationInput | CountryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Countries.
     */
    cursor?: CountryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Countries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Countries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Countries.
     */
    distinct?: CountryScalarFieldEnum | CountryScalarFieldEnum[]
  }

  /**
   * Country findFirstOrThrow
   */
  export type CountryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * Filter, which Country to fetch.
     */
    where?: CountryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Countries to fetch.
     */
    orderBy?: CountryOrderByWithRelationInput | CountryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Countries.
     */
    cursor?: CountryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Countries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Countries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Countries.
     */
    distinct?: CountryScalarFieldEnum | CountryScalarFieldEnum[]
  }

  /**
   * Country findMany
   */
  export type CountryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * Filter, which Countries to fetch.
     */
    where?: CountryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Countries to fetch.
     */
    orderBy?: CountryOrderByWithRelationInput | CountryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Countries.
     */
    cursor?: CountryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Countries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Countries.
     */
    skip?: number
    distinct?: CountryScalarFieldEnum | CountryScalarFieldEnum[]
  }

  /**
   * Country create
   */
  export type CountryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * The data needed to create a Country.
     */
    data: XOR<CountryCreateInput, CountryUncheckedCreateInput>
  }

  /**
   * Country createMany
   */
  export type CountryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Countries.
     */
    data: CountryCreateManyInput | CountryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Country createManyAndReturn
   */
  export type CountryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * The data used to create many Countries.
     */
    data: CountryCreateManyInput | CountryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Country update
   */
  export type CountryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * The data needed to update a Country.
     */
    data: XOR<CountryUpdateInput, CountryUncheckedUpdateInput>
    /**
     * Choose, which Country to update.
     */
    where: CountryWhereUniqueInput
  }

  /**
   * Country updateMany
   */
  export type CountryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Countries.
     */
    data: XOR<CountryUpdateManyMutationInput, CountryUncheckedUpdateManyInput>
    /**
     * Filter which Countries to update
     */
    where?: CountryWhereInput
    /**
     * Limit how many Countries to update.
     */
    limit?: number
  }

  /**
   * Country updateManyAndReturn
   */
  export type CountryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * The data used to update Countries.
     */
    data: XOR<CountryUpdateManyMutationInput, CountryUncheckedUpdateManyInput>
    /**
     * Filter which Countries to update
     */
    where?: CountryWhereInput
    /**
     * Limit how many Countries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Country upsert
   */
  export type CountryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * The filter to search for the Country to update in case it exists.
     */
    where: CountryWhereUniqueInput
    /**
     * In case the Country found by the `where` argument doesn't exist, create a new Country with this data.
     */
    create: XOR<CountryCreateInput, CountryUncheckedCreateInput>
    /**
     * In case the Country was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CountryUpdateInput, CountryUncheckedUpdateInput>
  }

  /**
   * Country delete
   */
  export type CountryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * Filter which Country to delete.
     */
    where: CountryWhereUniqueInput
  }

  /**
   * Country deleteMany
   */
  export type CountryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Countries to delete
     */
    where?: CountryWhereInput
    /**
     * Limit how many Countries to delete.
     */
    limit?: number
  }

  /**
   * Country without action
   */
  export type CountryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Country
     */
    omit?: CountryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
  }


  /**
   * Model Town
   */

  export type AggregateTown = {
    _count: TownCountAggregateOutputType | null
    _min: TownMinAggregateOutputType | null
    _max: TownMaxAggregateOutputType | null
  }

  export type TownMinAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    map: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TownMaxAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    map: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TownCountAggregateOutputType = {
    id: number
    name: number
    icon: number
    description: number
    map: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TownMinAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TownMaxAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TownCountAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TownAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Town to aggregate.
     */
    where?: TownWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Towns to fetch.
     */
    orderBy?: TownOrderByWithRelationInput | TownOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TownWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Towns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Towns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Towns
    **/
    _count?: true | TownCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TownMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TownMaxAggregateInputType
  }

  export type GetTownAggregateType<T extends TownAggregateArgs> = {
        [P in keyof T & keyof AggregateTown]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTown[P]>
      : GetScalarType<T[P], AggregateTown[P]>
  }




  export type TownGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TownWhereInput
    orderBy?: TownOrderByWithAggregationInput | TownOrderByWithAggregationInput[]
    by: TownScalarFieldEnum[] | TownScalarFieldEnum
    having?: TownScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TownCountAggregateInputType | true
    _min?: TownMinAggregateInputType
    _max?: TownMaxAggregateInputType
  }

  export type TownGroupByOutputType = {
    id: string
    name: string
    icon: string
    description: string | null
    map: string
    createdAt: Date | null
    updatedAt: Date | null
    _count: TownCountAggregateOutputType | null
    _min: TownMinAggregateOutputType | null
    _max: TownMaxAggregateOutputType | null
  }

  type GetTownGroupByPayload<T extends TownGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TownGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TownGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TownGroupByOutputType[P]>
            : GetScalarType<T[P], TownGroupByOutputType[P]>
        }
      >
    >


  export type TownSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
    poi?: boolean | Town$poiArgs<ExtArgs>
    _count?: boolean | TownCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["town"]>

  export type TownSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["town"]>

  export type TownSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["town"]>

  export type TownSelectScalar = {
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TownOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "icon" | "description" | "map" | "createdAt" | "updatedAt", ExtArgs["result"]["town"]>
  export type TownInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
    poi?: boolean | Town$poiArgs<ExtArgs>
    _count?: boolean | TownCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TownIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }
  export type TownIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }

  export type $TownPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Town"
    objects: {
      maps: Prisma.$MapPayload<ExtArgs>
      poi: Prisma.$PointOfInterestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      icon: string
      description: string | null
      map: string
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["town"]>
    composites: {}
  }

  type TownGetPayload<S extends boolean | null | undefined | TownDefaultArgs> = $Result.GetResult<Prisma.$TownPayload, S>

  type TownCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TownFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TownCountAggregateInputType | true
    }

  export interface TownDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Town'], meta: { name: 'Town' } }
    /**
     * Find zero or one Town that matches the filter.
     * @param {TownFindUniqueArgs} args - Arguments to find a Town
     * @example
     * // Get one Town
     * const town = await prisma.town.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TownFindUniqueArgs>(args: SelectSubset<T, TownFindUniqueArgs<ExtArgs>>): Prisma__TownClient<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Town that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TownFindUniqueOrThrowArgs} args - Arguments to find a Town
     * @example
     * // Get one Town
     * const town = await prisma.town.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TownFindUniqueOrThrowArgs>(args: SelectSubset<T, TownFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TownClient<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Town that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TownFindFirstArgs} args - Arguments to find a Town
     * @example
     * // Get one Town
     * const town = await prisma.town.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TownFindFirstArgs>(args?: SelectSubset<T, TownFindFirstArgs<ExtArgs>>): Prisma__TownClient<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Town that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TownFindFirstOrThrowArgs} args - Arguments to find a Town
     * @example
     * // Get one Town
     * const town = await prisma.town.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TownFindFirstOrThrowArgs>(args?: SelectSubset<T, TownFindFirstOrThrowArgs<ExtArgs>>): Prisma__TownClient<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Towns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TownFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Towns
     * const towns = await prisma.town.findMany()
     * 
     * // Get first 10 Towns
     * const towns = await prisma.town.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const townWithIdOnly = await prisma.town.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TownFindManyArgs>(args?: SelectSubset<T, TownFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Town.
     * @param {TownCreateArgs} args - Arguments to create a Town.
     * @example
     * // Create one Town
     * const Town = await prisma.town.create({
     *   data: {
     *     // ... data to create a Town
     *   }
     * })
     * 
     */
    create<T extends TownCreateArgs>(args: SelectSubset<T, TownCreateArgs<ExtArgs>>): Prisma__TownClient<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Towns.
     * @param {TownCreateManyArgs} args - Arguments to create many Towns.
     * @example
     * // Create many Towns
     * const town = await prisma.town.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TownCreateManyArgs>(args?: SelectSubset<T, TownCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Towns and returns the data saved in the database.
     * @param {TownCreateManyAndReturnArgs} args - Arguments to create many Towns.
     * @example
     * // Create many Towns
     * const town = await prisma.town.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Towns and only return the `id`
     * const townWithIdOnly = await prisma.town.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TownCreateManyAndReturnArgs>(args?: SelectSubset<T, TownCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Town.
     * @param {TownDeleteArgs} args - Arguments to delete one Town.
     * @example
     * // Delete one Town
     * const Town = await prisma.town.delete({
     *   where: {
     *     // ... filter to delete one Town
     *   }
     * })
     * 
     */
    delete<T extends TownDeleteArgs>(args: SelectSubset<T, TownDeleteArgs<ExtArgs>>): Prisma__TownClient<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Town.
     * @param {TownUpdateArgs} args - Arguments to update one Town.
     * @example
     * // Update one Town
     * const town = await prisma.town.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TownUpdateArgs>(args: SelectSubset<T, TownUpdateArgs<ExtArgs>>): Prisma__TownClient<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Towns.
     * @param {TownDeleteManyArgs} args - Arguments to filter Towns to delete.
     * @example
     * // Delete a few Towns
     * const { count } = await prisma.town.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TownDeleteManyArgs>(args?: SelectSubset<T, TownDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Towns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TownUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Towns
     * const town = await prisma.town.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TownUpdateManyArgs>(args: SelectSubset<T, TownUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Towns and returns the data updated in the database.
     * @param {TownUpdateManyAndReturnArgs} args - Arguments to update many Towns.
     * @example
     * // Update many Towns
     * const town = await prisma.town.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Towns and only return the `id`
     * const townWithIdOnly = await prisma.town.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TownUpdateManyAndReturnArgs>(args: SelectSubset<T, TownUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Town.
     * @param {TownUpsertArgs} args - Arguments to update or create a Town.
     * @example
     * // Update or create a Town
     * const town = await prisma.town.upsert({
     *   create: {
     *     // ... data to create a Town
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Town we want to update
     *   }
     * })
     */
    upsert<T extends TownUpsertArgs>(args: SelectSubset<T, TownUpsertArgs<ExtArgs>>): Prisma__TownClient<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Towns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TownCountArgs} args - Arguments to filter Towns to count.
     * @example
     * // Count the number of Towns
     * const count = await prisma.town.count({
     *   where: {
     *     // ... the filter for the Towns we want to count
     *   }
     * })
    **/
    count<T extends TownCountArgs>(
      args?: Subset<T, TownCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TownCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Town.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TownAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TownAggregateArgs>(args: Subset<T, TownAggregateArgs>): Prisma.PrismaPromise<GetTownAggregateType<T>>

    /**
     * Group by Town.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TownGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TownGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TownGroupByArgs['orderBy'] }
        : { orderBy?: TownGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TownGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTownGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Town model
   */
  readonly fields: TownFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Town.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TownClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    maps<T extends MapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MapDefaultArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    poi<T extends Town$poiArgs<ExtArgs> = {}>(args?: Subset<T, Town$poiArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Town model
   */
  interface TownFieldRefs {
    readonly id: FieldRef<"Town", 'String'>
    readonly name: FieldRef<"Town", 'String'>
    readonly icon: FieldRef<"Town", 'String'>
    readonly description: FieldRef<"Town", 'String'>
    readonly map: FieldRef<"Town", 'String'>
    readonly createdAt: FieldRef<"Town", 'DateTime'>
    readonly updatedAt: FieldRef<"Town", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Town findUnique
   */
  export type TownFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownInclude<ExtArgs> | null
    /**
     * Filter, which Town to fetch.
     */
    where: TownWhereUniqueInput
  }

  /**
   * Town findUniqueOrThrow
   */
  export type TownFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownInclude<ExtArgs> | null
    /**
     * Filter, which Town to fetch.
     */
    where: TownWhereUniqueInput
  }

  /**
   * Town findFirst
   */
  export type TownFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownInclude<ExtArgs> | null
    /**
     * Filter, which Town to fetch.
     */
    where?: TownWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Towns to fetch.
     */
    orderBy?: TownOrderByWithRelationInput | TownOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Towns.
     */
    cursor?: TownWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Towns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Towns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Towns.
     */
    distinct?: TownScalarFieldEnum | TownScalarFieldEnum[]
  }

  /**
   * Town findFirstOrThrow
   */
  export type TownFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownInclude<ExtArgs> | null
    /**
     * Filter, which Town to fetch.
     */
    where?: TownWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Towns to fetch.
     */
    orderBy?: TownOrderByWithRelationInput | TownOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Towns.
     */
    cursor?: TownWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Towns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Towns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Towns.
     */
    distinct?: TownScalarFieldEnum | TownScalarFieldEnum[]
  }

  /**
   * Town findMany
   */
  export type TownFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownInclude<ExtArgs> | null
    /**
     * Filter, which Towns to fetch.
     */
    where?: TownWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Towns to fetch.
     */
    orderBy?: TownOrderByWithRelationInput | TownOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Towns.
     */
    cursor?: TownWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Towns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Towns.
     */
    skip?: number
    distinct?: TownScalarFieldEnum | TownScalarFieldEnum[]
  }

  /**
   * Town create
   */
  export type TownCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownInclude<ExtArgs> | null
    /**
     * The data needed to create a Town.
     */
    data: XOR<TownCreateInput, TownUncheckedCreateInput>
  }

  /**
   * Town createMany
   */
  export type TownCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Towns.
     */
    data: TownCreateManyInput | TownCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Town createManyAndReturn
   */
  export type TownCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * The data used to create many Towns.
     */
    data: TownCreateManyInput | TownCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Town update
   */
  export type TownUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownInclude<ExtArgs> | null
    /**
     * The data needed to update a Town.
     */
    data: XOR<TownUpdateInput, TownUncheckedUpdateInput>
    /**
     * Choose, which Town to update.
     */
    where: TownWhereUniqueInput
  }

  /**
   * Town updateMany
   */
  export type TownUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Towns.
     */
    data: XOR<TownUpdateManyMutationInput, TownUncheckedUpdateManyInput>
    /**
     * Filter which Towns to update
     */
    where?: TownWhereInput
    /**
     * Limit how many Towns to update.
     */
    limit?: number
  }

  /**
   * Town updateManyAndReturn
   */
  export type TownUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * The data used to update Towns.
     */
    data: XOR<TownUpdateManyMutationInput, TownUncheckedUpdateManyInput>
    /**
     * Filter which Towns to update
     */
    where?: TownWhereInput
    /**
     * Limit how many Towns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Town upsert
   */
  export type TownUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownInclude<ExtArgs> | null
    /**
     * The filter to search for the Town to update in case it exists.
     */
    where: TownWhereUniqueInput
    /**
     * In case the Town found by the `where` argument doesn't exist, create a new Town with this data.
     */
    create: XOR<TownCreateInput, TownUncheckedCreateInput>
    /**
     * In case the Town was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TownUpdateInput, TownUncheckedUpdateInput>
  }

  /**
   * Town delete
   */
  export type TownDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownInclude<ExtArgs> | null
    /**
     * Filter which Town to delete.
     */
    where: TownWhereUniqueInput
  }

  /**
   * Town deleteMany
   */
  export type TownDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Towns to delete
     */
    where?: TownWhereInput
    /**
     * Limit how many Towns to delete.
     */
    limit?: number
  }

  /**
   * Town.poi
   */
  export type Town$poiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestInclude<ExtArgs> | null
    where?: PointOfInterestWhereInput
    orderBy?: PointOfInterestOrderByWithRelationInput | PointOfInterestOrderByWithRelationInput[]
    cursor?: PointOfInterestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PointOfInterestScalarFieldEnum | PointOfInterestScalarFieldEnum[]
  }

  /**
   * Town without action
   */
  export type TownDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Town
     */
    select?: TownSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Town
     */
    omit?: TownOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TownInclude<ExtArgs> | null
  }


  /**
   * Model Village
   */

  export type AggregateVillage = {
    _count: VillageCountAggregateOutputType | null
    _min: VillageMinAggregateOutputType | null
    _max: VillageMaxAggregateOutputType | null
  }

  export type VillageMinAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    map: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VillageMaxAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    map: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VillageCountAggregateOutputType = {
    id: number
    name: number
    icon: number
    description: number
    map: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VillageMinAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VillageMaxAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VillageCountAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VillageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Village to aggregate.
     */
    where?: VillageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Villages to fetch.
     */
    orderBy?: VillageOrderByWithRelationInput | VillageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VillageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Villages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Villages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Villages
    **/
    _count?: true | VillageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VillageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VillageMaxAggregateInputType
  }

  export type GetVillageAggregateType<T extends VillageAggregateArgs> = {
        [P in keyof T & keyof AggregateVillage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVillage[P]>
      : GetScalarType<T[P], AggregateVillage[P]>
  }




  export type VillageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VillageWhereInput
    orderBy?: VillageOrderByWithAggregationInput | VillageOrderByWithAggregationInput[]
    by: VillageScalarFieldEnum[] | VillageScalarFieldEnum
    having?: VillageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VillageCountAggregateInputType | true
    _min?: VillageMinAggregateInputType
    _max?: VillageMaxAggregateInputType
  }

  export type VillageGroupByOutputType = {
    id: string
    name: string
    icon: string
    description: string | null
    map: string
    createdAt: Date | null
    updatedAt: Date | null
    _count: VillageCountAggregateOutputType | null
    _min: VillageMinAggregateOutputType | null
    _max: VillageMaxAggregateOutputType | null
  }

  type GetVillageGroupByPayload<T extends VillageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VillageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VillageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VillageGroupByOutputType[P]>
            : GetScalarType<T[P], VillageGroupByOutputType[P]>
        }
      >
    >


  export type VillageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["village"]>

  export type VillageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["village"]>

  export type VillageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["village"]>

  export type VillageSelectScalar = {
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VillageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "icon" | "description" | "map" | "createdAt" | "updatedAt", ExtArgs["result"]["village"]>
  export type VillageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }
  export type VillageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }
  export type VillageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }

  export type $VillagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Village"
    objects: {
      maps: Prisma.$MapPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      icon: string
      description: string | null
      map: string
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["village"]>
    composites: {}
  }

  type VillageGetPayload<S extends boolean | null | undefined | VillageDefaultArgs> = $Result.GetResult<Prisma.$VillagePayload, S>

  type VillageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VillageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VillageCountAggregateInputType | true
    }

  export interface VillageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Village'], meta: { name: 'Village' } }
    /**
     * Find zero or one Village that matches the filter.
     * @param {VillageFindUniqueArgs} args - Arguments to find a Village
     * @example
     * // Get one Village
     * const village = await prisma.village.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VillageFindUniqueArgs>(args: SelectSubset<T, VillageFindUniqueArgs<ExtArgs>>): Prisma__VillageClient<$Result.GetResult<Prisma.$VillagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Village that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VillageFindUniqueOrThrowArgs} args - Arguments to find a Village
     * @example
     * // Get one Village
     * const village = await prisma.village.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VillageFindUniqueOrThrowArgs>(args: SelectSubset<T, VillageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VillageClient<$Result.GetResult<Prisma.$VillagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Village that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VillageFindFirstArgs} args - Arguments to find a Village
     * @example
     * // Get one Village
     * const village = await prisma.village.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VillageFindFirstArgs>(args?: SelectSubset<T, VillageFindFirstArgs<ExtArgs>>): Prisma__VillageClient<$Result.GetResult<Prisma.$VillagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Village that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VillageFindFirstOrThrowArgs} args - Arguments to find a Village
     * @example
     * // Get one Village
     * const village = await prisma.village.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VillageFindFirstOrThrowArgs>(args?: SelectSubset<T, VillageFindFirstOrThrowArgs<ExtArgs>>): Prisma__VillageClient<$Result.GetResult<Prisma.$VillagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Villages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VillageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Villages
     * const villages = await prisma.village.findMany()
     * 
     * // Get first 10 Villages
     * const villages = await prisma.village.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const villageWithIdOnly = await prisma.village.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VillageFindManyArgs>(args?: SelectSubset<T, VillageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VillagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Village.
     * @param {VillageCreateArgs} args - Arguments to create a Village.
     * @example
     * // Create one Village
     * const Village = await prisma.village.create({
     *   data: {
     *     // ... data to create a Village
     *   }
     * })
     * 
     */
    create<T extends VillageCreateArgs>(args: SelectSubset<T, VillageCreateArgs<ExtArgs>>): Prisma__VillageClient<$Result.GetResult<Prisma.$VillagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Villages.
     * @param {VillageCreateManyArgs} args - Arguments to create many Villages.
     * @example
     * // Create many Villages
     * const village = await prisma.village.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VillageCreateManyArgs>(args?: SelectSubset<T, VillageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Villages and returns the data saved in the database.
     * @param {VillageCreateManyAndReturnArgs} args - Arguments to create many Villages.
     * @example
     * // Create many Villages
     * const village = await prisma.village.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Villages and only return the `id`
     * const villageWithIdOnly = await prisma.village.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VillageCreateManyAndReturnArgs>(args?: SelectSubset<T, VillageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VillagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Village.
     * @param {VillageDeleteArgs} args - Arguments to delete one Village.
     * @example
     * // Delete one Village
     * const Village = await prisma.village.delete({
     *   where: {
     *     // ... filter to delete one Village
     *   }
     * })
     * 
     */
    delete<T extends VillageDeleteArgs>(args: SelectSubset<T, VillageDeleteArgs<ExtArgs>>): Prisma__VillageClient<$Result.GetResult<Prisma.$VillagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Village.
     * @param {VillageUpdateArgs} args - Arguments to update one Village.
     * @example
     * // Update one Village
     * const village = await prisma.village.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VillageUpdateArgs>(args: SelectSubset<T, VillageUpdateArgs<ExtArgs>>): Prisma__VillageClient<$Result.GetResult<Prisma.$VillagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Villages.
     * @param {VillageDeleteManyArgs} args - Arguments to filter Villages to delete.
     * @example
     * // Delete a few Villages
     * const { count } = await prisma.village.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VillageDeleteManyArgs>(args?: SelectSubset<T, VillageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Villages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VillageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Villages
     * const village = await prisma.village.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VillageUpdateManyArgs>(args: SelectSubset<T, VillageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Villages and returns the data updated in the database.
     * @param {VillageUpdateManyAndReturnArgs} args - Arguments to update many Villages.
     * @example
     * // Update many Villages
     * const village = await prisma.village.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Villages and only return the `id`
     * const villageWithIdOnly = await prisma.village.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VillageUpdateManyAndReturnArgs>(args: SelectSubset<T, VillageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VillagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Village.
     * @param {VillageUpsertArgs} args - Arguments to update or create a Village.
     * @example
     * // Update or create a Village
     * const village = await prisma.village.upsert({
     *   create: {
     *     // ... data to create a Village
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Village we want to update
     *   }
     * })
     */
    upsert<T extends VillageUpsertArgs>(args: SelectSubset<T, VillageUpsertArgs<ExtArgs>>): Prisma__VillageClient<$Result.GetResult<Prisma.$VillagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Villages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VillageCountArgs} args - Arguments to filter Villages to count.
     * @example
     * // Count the number of Villages
     * const count = await prisma.village.count({
     *   where: {
     *     // ... the filter for the Villages we want to count
     *   }
     * })
    **/
    count<T extends VillageCountArgs>(
      args?: Subset<T, VillageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VillageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Village.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VillageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VillageAggregateArgs>(args: Subset<T, VillageAggregateArgs>): Prisma.PrismaPromise<GetVillageAggregateType<T>>

    /**
     * Group by Village.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VillageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VillageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VillageGroupByArgs['orderBy'] }
        : { orderBy?: VillageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VillageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVillageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Village model
   */
  readonly fields: VillageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Village.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VillageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    maps<T extends MapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MapDefaultArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Village model
   */
  interface VillageFieldRefs {
    readonly id: FieldRef<"Village", 'String'>
    readonly name: FieldRef<"Village", 'String'>
    readonly icon: FieldRef<"Village", 'String'>
    readonly description: FieldRef<"Village", 'String'>
    readonly map: FieldRef<"Village", 'String'>
    readonly createdAt: FieldRef<"Village", 'DateTime'>
    readonly updatedAt: FieldRef<"Village", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Village findUnique
   */
  export type VillageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageInclude<ExtArgs> | null
    /**
     * Filter, which Village to fetch.
     */
    where: VillageWhereUniqueInput
  }

  /**
   * Village findUniqueOrThrow
   */
  export type VillageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageInclude<ExtArgs> | null
    /**
     * Filter, which Village to fetch.
     */
    where: VillageWhereUniqueInput
  }

  /**
   * Village findFirst
   */
  export type VillageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageInclude<ExtArgs> | null
    /**
     * Filter, which Village to fetch.
     */
    where?: VillageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Villages to fetch.
     */
    orderBy?: VillageOrderByWithRelationInput | VillageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Villages.
     */
    cursor?: VillageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Villages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Villages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Villages.
     */
    distinct?: VillageScalarFieldEnum | VillageScalarFieldEnum[]
  }

  /**
   * Village findFirstOrThrow
   */
  export type VillageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageInclude<ExtArgs> | null
    /**
     * Filter, which Village to fetch.
     */
    where?: VillageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Villages to fetch.
     */
    orderBy?: VillageOrderByWithRelationInput | VillageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Villages.
     */
    cursor?: VillageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Villages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Villages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Villages.
     */
    distinct?: VillageScalarFieldEnum | VillageScalarFieldEnum[]
  }

  /**
   * Village findMany
   */
  export type VillageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageInclude<ExtArgs> | null
    /**
     * Filter, which Villages to fetch.
     */
    where?: VillageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Villages to fetch.
     */
    orderBy?: VillageOrderByWithRelationInput | VillageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Villages.
     */
    cursor?: VillageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Villages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Villages.
     */
    skip?: number
    distinct?: VillageScalarFieldEnum | VillageScalarFieldEnum[]
  }

  /**
   * Village create
   */
  export type VillageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageInclude<ExtArgs> | null
    /**
     * The data needed to create a Village.
     */
    data: XOR<VillageCreateInput, VillageUncheckedCreateInput>
  }

  /**
   * Village createMany
   */
  export type VillageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Villages.
     */
    data: VillageCreateManyInput | VillageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Village createManyAndReturn
   */
  export type VillageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * The data used to create many Villages.
     */
    data: VillageCreateManyInput | VillageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Village update
   */
  export type VillageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageInclude<ExtArgs> | null
    /**
     * The data needed to update a Village.
     */
    data: XOR<VillageUpdateInput, VillageUncheckedUpdateInput>
    /**
     * Choose, which Village to update.
     */
    where: VillageWhereUniqueInput
  }

  /**
   * Village updateMany
   */
  export type VillageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Villages.
     */
    data: XOR<VillageUpdateManyMutationInput, VillageUncheckedUpdateManyInput>
    /**
     * Filter which Villages to update
     */
    where?: VillageWhereInput
    /**
     * Limit how many Villages to update.
     */
    limit?: number
  }

  /**
   * Village updateManyAndReturn
   */
  export type VillageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * The data used to update Villages.
     */
    data: XOR<VillageUpdateManyMutationInput, VillageUncheckedUpdateManyInput>
    /**
     * Filter which Villages to update
     */
    where?: VillageWhereInput
    /**
     * Limit how many Villages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Village upsert
   */
  export type VillageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageInclude<ExtArgs> | null
    /**
     * The filter to search for the Village to update in case it exists.
     */
    where: VillageWhereUniqueInput
    /**
     * In case the Village found by the `where` argument doesn't exist, create a new Village with this data.
     */
    create: XOR<VillageCreateInput, VillageUncheckedCreateInput>
    /**
     * In case the Village was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VillageUpdateInput, VillageUncheckedUpdateInput>
  }

  /**
   * Village delete
   */
  export type VillageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageInclude<ExtArgs> | null
    /**
     * Filter which Village to delete.
     */
    where: VillageWhereUniqueInput
  }

  /**
   * Village deleteMany
   */
  export type VillageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Villages to delete
     */
    where?: VillageWhereInput
    /**
     * Limit how many Villages to delete.
     */
    limit?: number
  }

  /**
   * Village without action
   */
  export type VillageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Village
     */
    select?: VillageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Village
     */
    omit?: VillageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VillageInclude<ExtArgs> | null
  }


  /**
   * Model PointOfInterest
   */

  export type AggregatePointOfInterest = {
    _count: PointOfInterestCountAggregateOutputType | null
    _min: PointOfInterestMinAggregateOutputType | null
    _max: PointOfInterestMaxAggregateOutputType | null
  }

  export type PointOfInterestMinAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    map: string | null
    town: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PointOfInterestMaxAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    map: string | null
    town: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PointOfInterestCountAggregateOutputType = {
    id: number
    name: number
    icon: number
    description: number
    map: number
    town: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PointOfInterestMinAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    map?: true
    town?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PointOfInterestMaxAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    map?: true
    town?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PointOfInterestCountAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    map?: true
    town?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PointOfInterestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PointOfInterest to aggregate.
     */
    where?: PointOfInterestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PointOfInterests to fetch.
     */
    orderBy?: PointOfInterestOrderByWithRelationInput | PointOfInterestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PointOfInterestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PointOfInterests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PointOfInterests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PointOfInterests
    **/
    _count?: true | PointOfInterestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PointOfInterestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PointOfInterestMaxAggregateInputType
  }

  export type GetPointOfInterestAggregateType<T extends PointOfInterestAggregateArgs> = {
        [P in keyof T & keyof AggregatePointOfInterest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePointOfInterest[P]>
      : GetScalarType<T[P], AggregatePointOfInterest[P]>
  }




  export type PointOfInterestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PointOfInterestWhereInput
    orderBy?: PointOfInterestOrderByWithAggregationInput | PointOfInterestOrderByWithAggregationInput[]
    by: PointOfInterestScalarFieldEnum[] | PointOfInterestScalarFieldEnum
    having?: PointOfInterestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PointOfInterestCountAggregateInputType | true
    _min?: PointOfInterestMinAggregateInputType
    _max?: PointOfInterestMaxAggregateInputType
  }

  export type PointOfInterestGroupByOutputType = {
    id: string
    name: string
    icon: string
    description: string | null
    map: string
    town: string
    createdAt: Date | null
    updatedAt: Date | null
    _count: PointOfInterestCountAggregateOutputType | null
    _min: PointOfInterestMinAggregateOutputType | null
    _max: PointOfInterestMaxAggregateOutputType | null
  }

  type GetPointOfInterestGroupByPayload<T extends PointOfInterestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PointOfInterestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PointOfInterestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PointOfInterestGroupByOutputType[P]>
            : GetScalarType<T[P], PointOfInterestGroupByOutputType[P]>
        }
      >
    >


  export type PointOfInterestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    map?: boolean
    town?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
    towns?: boolean | TownDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pointOfInterest"]>

  export type PointOfInterestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    map?: boolean
    town?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
    towns?: boolean | TownDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pointOfInterest"]>

  export type PointOfInterestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    map?: boolean
    town?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
    towns?: boolean | TownDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pointOfInterest"]>

  export type PointOfInterestSelectScalar = {
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    map?: boolean
    town?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PointOfInterestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "icon" | "description" | "map" | "town" | "createdAt" | "updatedAt", ExtArgs["result"]["pointOfInterest"]>
  export type PointOfInterestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
    towns?: boolean | TownDefaultArgs<ExtArgs>
  }
  export type PointOfInterestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
    towns?: boolean | TownDefaultArgs<ExtArgs>
  }
  export type PointOfInterestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
    towns?: boolean | TownDefaultArgs<ExtArgs>
  }

  export type $PointOfInterestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PointOfInterest"
    objects: {
      maps: Prisma.$MapPayload<ExtArgs>
      towns: Prisma.$TownPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      icon: string
      description: string | null
      map: string
      town: string
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["pointOfInterest"]>
    composites: {}
  }

  type PointOfInterestGetPayload<S extends boolean | null | undefined | PointOfInterestDefaultArgs> = $Result.GetResult<Prisma.$PointOfInterestPayload, S>

  type PointOfInterestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PointOfInterestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PointOfInterestCountAggregateInputType | true
    }

  export interface PointOfInterestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PointOfInterest'], meta: { name: 'PointOfInterest' } }
    /**
     * Find zero or one PointOfInterest that matches the filter.
     * @param {PointOfInterestFindUniqueArgs} args - Arguments to find a PointOfInterest
     * @example
     * // Get one PointOfInterest
     * const pointOfInterest = await prisma.pointOfInterest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PointOfInterestFindUniqueArgs>(args: SelectSubset<T, PointOfInterestFindUniqueArgs<ExtArgs>>): Prisma__PointOfInterestClient<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PointOfInterest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PointOfInterestFindUniqueOrThrowArgs} args - Arguments to find a PointOfInterest
     * @example
     * // Get one PointOfInterest
     * const pointOfInterest = await prisma.pointOfInterest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PointOfInterestFindUniqueOrThrowArgs>(args: SelectSubset<T, PointOfInterestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PointOfInterestClient<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PointOfInterest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PointOfInterestFindFirstArgs} args - Arguments to find a PointOfInterest
     * @example
     * // Get one PointOfInterest
     * const pointOfInterest = await prisma.pointOfInterest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PointOfInterestFindFirstArgs>(args?: SelectSubset<T, PointOfInterestFindFirstArgs<ExtArgs>>): Prisma__PointOfInterestClient<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PointOfInterest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PointOfInterestFindFirstOrThrowArgs} args - Arguments to find a PointOfInterest
     * @example
     * // Get one PointOfInterest
     * const pointOfInterest = await prisma.pointOfInterest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PointOfInterestFindFirstOrThrowArgs>(args?: SelectSubset<T, PointOfInterestFindFirstOrThrowArgs<ExtArgs>>): Prisma__PointOfInterestClient<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PointOfInterests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PointOfInterestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PointOfInterests
     * const pointOfInterests = await prisma.pointOfInterest.findMany()
     * 
     * // Get first 10 PointOfInterests
     * const pointOfInterests = await prisma.pointOfInterest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pointOfInterestWithIdOnly = await prisma.pointOfInterest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PointOfInterestFindManyArgs>(args?: SelectSubset<T, PointOfInterestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PointOfInterest.
     * @param {PointOfInterestCreateArgs} args - Arguments to create a PointOfInterest.
     * @example
     * // Create one PointOfInterest
     * const PointOfInterest = await prisma.pointOfInterest.create({
     *   data: {
     *     // ... data to create a PointOfInterest
     *   }
     * })
     * 
     */
    create<T extends PointOfInterestCreateArgs>(args: SelectSubset<T, PointOfInterestCreateArgs<ExtArgs>>): Prisma__PointOfInterestClient<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PointOfInterests.
     * @param {PointOfInterestCreateManyArgs} args - Arguments to create many PointOfInterests.
     * @example
     * // Create many PointOfInterests
     * const pointOfInterest = await prisma.pointOfInterest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PointOfInterestCreateManyArgs>(args?: SelectSubset<T, PointOfInterestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PointOfInterests and returns the data saved in the database.
     * @param {PointOfInterestCreateManyAndReturnArgs} args - Arguments to create many PointOfInterests.
     * @example
     * // Create many PointOfInterests
     * const pointOfInterest = await prisma.pointOfInterest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PointOfInterests and only return the `id`
     * const pointOfInterestWithIdOnly = await prisma.pointOfInterest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PointOfInterestCreateManyAndReturnArgs>(args?: SelectSubset<T, PointOfInterestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PointOfInterest.
     * @param {PointOfInterestDeleteArgs} args - Arguments to delete one PointOfInterest.
     * @example
     * // Delete one PointOfInterest
     * const PointOfInterest = await prisma.pointOfInterest.delete({
     *   where: {
     *     // ... filter to delete one PointOfInterest
     *   }
     * })
     * 
     */
    delete<T extends PointOfInterestDeleteArgs>(args: SelectSubset<T, PointOfInterestDeleteArgs<ExtArgs>>): Prisma__PointOfInterestClient<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PointOfInterest.
     * @param {PointOfInterestUpdateArgs} args - Arguments to update one PointOfInterest.
     * @example
     * // Update one PointOfInterest
     * const pointOfInterest = await prisma.pointOfInterest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PointOfInterestUpdateArgs>(args: SelectSubset<T, PointOfInterestUpdateArgs<ExtArgs>>): Prisma__PointOfInterestClient<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PointOfInterests.
     * @param {PointOfInterestDeleteManyArgs} args - Arguments to filter PointOfInterests to delete.
     * @example
     * // Delete a few PointOfInterests
     * const { count } = await prisma.pointOfInterest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PointOfInterestDeleteManyArgs>(args?: SelectSubset<T, PointOfInterestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PointOfInterests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PointOfInterestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PointOfInterests
     * const pointOfInterest = await prisma.pointOfInterest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PointOfInterestUpdateManyArgs>(args: SelectSubset<T, PointOfInterestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PointOfInterests and returns the data updated in the database.
     * @param {PointOfInterestUpdateManyAndReturnArgs} args - Arguments to update many PointOfInterests.
     * @example
     * // Update many PointOfInterests
     * const pointOfInterest = await prisma.pointOfInterest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PointOfInterests and only return the `id`
     * const pointOfInterestWithIdOnly = await prisma.pointOfInterest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PointOfInterestUpdateManyAndReturnArgs>(args: SelectSubset<T, PointOfInterestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PointOfInterest.
     * @param {PointOfInterestUpsertArgs} args - Arguments to update or create a PointOfInterest.
     * @example
     * // Update or create a PointOfInterest
     * const pointOfInterest = await prisma.pointOfInterest.upsert({
     *   create: {
     *     // ... data to create a PointOfInterest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PointOfInterest we want to update
     *   }
     * })
     */
    upsert<T extends PointOfInterestUpsertArgs>(args: SelectSubset<T, PointOfInterestUpsertArgs<ExtArgs>>): Prisma__PointOfInterestClient<$Result.GetResult<Prisma.$PointOfInterestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PointOfInterests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PointOfInterestCountArgs} args - Arguments to filter PointOfInterests to count.
     * @example
     * // Count the number of PointOfInterests
     * const count = await prisma.pointOfInterest.count({
     *   where: {
     *     // ... the filter for the PointOfInterests we want to count
     *   }
     * })
    **/
    count<T extends PointOfInterestCountArgs>(
      args?: Subset<T, PointOfInterestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PointOfInterestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PointOfInterest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PointOfInterestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PointOfInterestAggregateArgs>(args: Subset<T, PointOfInterestAggregateArgs>): Prisma.PrismaPromise<GetPointOfInterestAggregateType<T>>

    /**
     * Group by PointOfInterest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PointOfInterestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PointOfInterestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PointOfInterestGroupByArgs['orderBy'] }
        : { orderBy?: PointOfInterestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PointOfInterestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPointOfInterestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PointOfInterest model
   */
  readonly fields: PointOfInterestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PointOfInterest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PointOfInterestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    maps<T extends MapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MapDefaultArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    towns<T extends TownDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TownDefaultArgs<ExtArgs>>): Prisma__TownClient<$Result.GetResult<Prisma.$TownPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PointOfInterest model
   */
  interface PointOfInterestFieldRefs {
    readonly id: FieldRef<"PointOfInterest", 'String'>
    readonly name: FieldRef<"PointOfInterest", 'String'>
    readonly icon: FieldRef<"PointOfInterest", 'String'>
    readonly description: FieldRef<"PointOfInterest", 'String'>
    readonly map: FieldRef<"PointOfInterest", 'String'>
    readonly town: FieldRef<"PointOfInterest", 'String'>
    readonly createdAt: FieldRef<"PointOfInterest", 'DateTime'>
    readonly updatedAt: FieldRef<"PointOfInterest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PointOfInterest findUnique
   */
  export type PointOfInterestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestInclude<ExtArgs> | null
    /**
     * Filter, which PointOfInterest to fetch.
     */
    where: PointOfInterestWhereUniqueInput
  }

  /**
   * PointOfInterest findUniqueOrThrow
   */
  export type PointOfInterestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestInclude<ExtArgs> | null
    /**
     * Filter, which PointOfInterest to fetch.
     */
    where: PointOfInterestWhereUniqueInput
  }

  /**
   * PointOfInterest findFirst
   */
  export type PointOfInterestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestInclude<ExtArgs> | null
    /**
     * Filter, which PointOfInterest to fetch.
     */
    where?: PointOfInterestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PointOfInterests to fetch.
     */
    orderBy?: PointOfInterestOrderByWithRelationInput | PointOfInterestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PointOfInterests.
     */
    cursor?: PointOfInterestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PointOfInterests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PointOfInterests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PointOfInterests.
     */
    distinct?: PointOfInterestScalarFieldEnum | PointOfInterestScalarFieldEnum[]
  }

  /**
   * PointOfInterest findFirstOrThrow
   */
  export type PointOfInterestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestInclude<ExtArgs> | null
    /**
     * Filter, which PointOfInterest to fetch.
     */
    where?: PointOfInterestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PointOfInterests to fetch.
     */
    orderBy?: PointOfInterestOrderByWithRelationInput | PointOfInterestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PointOfInterests.
     */
    cursor?: PointOfInterestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PointOfInterests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PointOfInterests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PointOfInterests.
     */
    distinct?: PointOfInterestScalarFieldEnum | PointOfInterestScalarFieldEnum[]
  }

  /**
   * PointOfInterest findMany
   */
  export type PointOfInterestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestInclude<ExtArgs> | null
    /**
     * Filter, which PointOfInterests to fetch.
     */
    where?: PointOfInterestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PointOfInterests to fetch.
     */
    orderBy?: PointOfInterestOrderByWithRelationInput | PointOfInterestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PointOfInterests.
     */
    cursor?: PointOfInterestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PointOfInterests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PointOfInterests.
     */
    skip?: number
    distinct?: PointOfInterestScalarFieldEnum | PointOfInterestScalarFieldEnum[]
  }

  /**
   * PointOfInterest create
   */
  export type PointOfInterestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestInclude<ExtArgs> | null
    /**
     * The data needed to create a PointOfInterest.
     */
    data: XOR<PointOfInterestCreateInput, PointOfInterestUncheckedCreateInput>
  }

  /**
   * PointOfInterest createMany
   */
  export type PointOfInterestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PointOfInterests.
     */
    data: PointOfInterestCreateManyInput | PointOfInterestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PointOfInterest createManyAndReturn
   */
  export type PointOfInterestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * The data used to create many PointOfInterests.
     */
    data: PointOfInterestCreateManyInput | PointOfInterestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PointOfInterest update
   */
  export type PointOfInterestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestInclude<ExtArgs> | null
    /**
     * The data needed to update a PointOfInterest.
     */
    data: XOR<PointOfInterestUpdateInput, PointOfInterestUncheckedUpdateInput>
    /**
     * Choose, which PointOfInterest to update.
     */
    where: PointOfInterestWhereUniqueInput
  }

  /**
   * PointOfInterest updateMany
   */
  export type PointOfInterestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PointOfInterests.
     */
    data: XOR<PointOfInterestUpdateManyMutationInput, PointOfInterestUncheckedUpdateManyInput>
    /**
     * Filter which PointOfInterests to update
     */
    where?: PointOfInterestWhereInput
    /**
     * Limit how many PointOfInterests to update.
     */
    limit?: number
  }

  /**
   * PointOfInterest updateManyAndReturn
   */
  export type PointOfInterestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * The data used to update PointOfInterests.
     */
    data: XOR<PointOfInterestUpdateManyMutationInput, PointOfInterestUncheckedUpdateManyInput>
    /**
     * Filter which PointOfInterests to update
     */
    where?: PointOfInterestWhereInput
    /**
     * Limit how many PointOfInterests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PointOfInterest upsert
   */
  export type PointOfInterestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestInclude<ExtArgs> | null
    /**
     * The filter to search for the PointOfInterest to update in case it exists.
     */
    where: PointOfInterestWhereUniqueInput
    /**
     * In case the PointOfInterest found by the `where` argument doesn't exist, create a new PointOfInterest with this data.
     */
    create: XOR<PointOfInterestCreateInput, PointOfInterestUncheckedCreateInput>
    /**
     * In case the PointOfInterest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PointOfInterestUpdateInput, PointOfInterestUncheckedUpdateInput>
  }

  /**
   * PointOfInterest delete
   */
  export type PointOfInterestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestInclude<ExtArgs> | null
    /**
     * Filter which PointOfInterest to delete.
     */
    where: PointOfInterestWhereUniqueInput
  }

  /**
   * PointOfInterest deleteMany
   */
  export type PointOfInterestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PointOfInterests to delete
     */
    where?: PointOfInterestWhereInput
    /**
     * Limit how many PointOfInterests to delete.
     */
    limit?: number
  }

  /**
   * PointOfInterest without action
   */
  export type PointOfInterestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PointOfInterest
     */
    select?: PointOfInterestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PointOfInterest
     */
    omit?: PointOfInterestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PointOfInterestInclude<ExtArgs> | null
  }


  /**
   * Model Population
   */

  export type AggregatePopulation = {
    _count: PopulationCountAggregateOutputType | null
    _min: PopulationMinAggregateOutputType | null
    _max: PopulationMaxAggregateOutputType | null
  }

  export type PopulationMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    map: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PopulationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    map: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PopulationCountAggregateOutputType = {
    id: number
    name: number
    description: number
    map: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PopulationMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PopulationMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PopulationCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PopulationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Population to aggregate.
     */
    where?: PopulationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Populations to fetch.
     */
    orderBy?: PopulationOrderByWithRelationInput | PopulationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PopulationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Populations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Populations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Populations
    **/
    _count?: true | PopulationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PopulationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PopulationMaxAggregateInputType
  }

  export type GetPopulationAggregateType<T extends PopulationAggregateArgs> = {
        [P in keyof T & keyof AggregatePopulation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePopulation[P]>
      : GetScalarType<T[P], AggregatePopulation[P]>
  }




  export type PopulationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PopulationWhereInput
    orderBy?: PopulationOrderByWithAggregationInput | PopulationOrderByWithAggregationInput[]
    by: PopulationScalarFieldEnum[] | PopulationScalarFieldEnum
    having?: PopulationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PopulationCountAggregateInputType | true
    _min?: PopulationMinAggregateInputType
    _max?: PopulationMaxAggregateInputType
  }

  export type PopulationGroupByOutputType = {
    id: string
    name: string
    description: string | null
    map: string
    createdAt: Date | null
    updatedAt: Date | null
    _count: PopulationCountAggregateOutputType | null
    _min: PopulationMinAggregateOutputType | null
    _max: PopulationMaxAggregateOutputType | null
  }

  type GetPopulationGroupByPayload<T extends PopulationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PopulationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PopulationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PopulationGroupByOutputType[P]>
            : GetScalarType<T[P], PopulationGroupByOutputType[P]>
        }
      >
    >


  export type PopulationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["population"]>

  export type PopulationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["population"]>

  export type PopulationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["population"]>

  export type PopulationSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PopulationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "map" | "createdAt" | "updatedAt", ExtArgs["result"]["population"]>
  export type PopulationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }
  export type PopulationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }
  export type PopulationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }

  export type $PopulationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Population"
    objects: {
      maps: Prisma.$MapPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      map: string
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["population"]>
    composites: {}
  }

  type PopulationGetPayload<S extends boolean | null | undefined | PopulationDefaultArgs> = $Result.GetResult<Prisma.$PopulationPayload, S>

  type PopulationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PopulationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PopulationCountAggregateInputType | true
    }

  export interface PopulationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Population'], meta: { name: 'Population' } }
    /**
     * Find zero or one Population that matches the filter.
     * @param {PopulationFindUniqueArgs} args - Arguments to find a Population
     * @example
     * // Get one Population
     * const population = await prisma.population.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PopulationFindUniqueArgs>(args: SelectSubset<T, PopulationFindUniqueArgs<ExtArgs>>): Prisma__PopulationClient<$Result.GetResult<Prisma.$PopulationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Population that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PopulationFindUniqueOrThrowArgs} args - Arguments to find a Population
     * @example
     * // Get one Population
     * const population = await prisma.population.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PopulationFindUniqueOrThrowArgs>(args: SelectSubset<T, PopulationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PopulationClient<$Result.GetResult<Prisma.$PopulationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Population that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PopulationFindFirstArgs} args - Arguments to find a Population
     * @example
     * // Get one Population
     * const population = await prisma.population.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PopulationFindFirstArgs>(args?: SelectSubset<T, PopulationFindFirstArgs<ExtArgs>>): Prisma__PopulationClient<$Result.GetResult<Prisma.$PopulationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Population that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PopulationFindFirstOrThrowArgs} args - Arguments to find a Population
     * @example
     * // Get one Population
     * const population = await prisma.population.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PopulationFindFirstOrThrowArgs>(args?: SelectSubset<T, PopulationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PopulationClient<$Result.GetResult<Prisma.$PopulationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Populations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PopulationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Populations
     * const populations = await prisma.population.findMany()
     * 
     * // Get first 10 Populations
     * const populations = await prisma.population.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const populationWithIdOnly = await prisma.population.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PopulationFindManyArgs>(args?: SelectSubset<T, PopulationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PopulationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Population.
     * @param {PopulationCreateArgs} args - Arguments to create a Population.
     * @example
     * // Create one Population
     * const Population = await prisma.population.create({
     *   data: {
     *     // ... data to create a Population
     *   }
     * })
     * 
     */
    create<T extends PopulationCreateArgs>(args: SelectSubset<T, PopulationCreateArgs<ExtArgs>>): Prisma__PopulationClient<$Result.GetResult<Prisma.$PopulationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Populations.
     * @param {PopulationCreateManyArgs} args - Arguments to create many Populations.
     * @example
     * // Create many Populations
     * const population = await prisma.population.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PopulationCreateManyArgs>(args?: SelectSubset<T, PopulationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Populations and returns the data saved in the database.
     * @param {PopulationCreateManyAndReturnArgs} args - Arguments to create many Populations.
     * @example
     * // Create many Populations
     * const population = await prisma.population.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Populations and only return the `id`
     * const populationWithIdOnly = await prisma.population.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PopulationCreateManyAndReturnArgs>(args?: SelectSubset<T, PopulationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PopulationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Population.
     * @param {PopulationDeleteArgs} args - Arguments to delete one Population.
     * @example
     * // Delete one Population
     * const Population = await prisma.population.delete({
     *   where: {
     *     // ... filter to delete one Population
     *   }
     * })
     * 
     */
    delete<T extends PopulationDeleteArgs>(args: SelectSubset<T, PopulationDeleteArgs<ExtArgs>>): Prisma__PopulationClient<$Result.GetResult<Prisma.$PopulationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Population.
     * @param {PopulationUpdateArgs} args - Arguments to update one Population.
     * @example
     * // Update one Population
     * const population = await prisma.population.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PopulationUpdateArgs>(args: SelectSubset<T, PopulationUpdateArgs<ExtArgs>>): Prisma__PopulationClient<$Result.GetResult<Prisma.$PopulationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Populations.
     * @param {PopulationDeleteManyArgs} args - Arguments to filter Populations to delete.
     * @example
     * // Delete a few Populations
     * const { count } = await prisma.population.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PopulationDeleteManyArgs>(args?: SelectSubset<T, PopulationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Populations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PopulationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Populations
     * const population = await prisma.population.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PopulationUpdateManyArgs>(args: SelectSubset<T, PopulationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Populations and returns the data updated in the database.
     * @param {PopulationUpdateManyAndReturnArgs} args - Arguments to update many Populations.
     * @example
     * // Update many Populations
     * const population = await prisma.population.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Populations and only return the `id`
     * const populationWithIdOnly = await prisma.population.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PopulationUpdateManyAndReturnArgs>(args: SelectSubset<T, PopulationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PopulationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Population.
     * @param {PopulationUpsertArgs} args - Arguments to update or create a Population.
     * @example
     * // Update or create a Population
     * const population = await prisma.population.upsert({
     *   create: {
     *     // ... data to create a Population
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Population we want to update
     *   }
     * })
     */
    upsert<T extends PopulationUpsertArgs>(args: SelectSubset<T, PopulationUpsertArgs<ExtArgs>>): Prisma__PopulationClient<$Result.GetResult<Prisma.$PopulationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Populations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PopulationCountArgs} args - Arguments to filter Populations to count.
     * @example
     * // Count the number of Populations
     * const count = await prisma.population.count({
     *   where: {
     *     // ... the filter for the Populations we want to count
     *   }
     * })
    **/
    count<T extends PopulationCountArgs>(
      args?: Subset<T, PopulationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PopulationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Population.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PopulationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PopulationAggregateArgs>(args: Subset<T, PopulationAggregateArgs>): Prisma.PrismaPromise<GetPopulationAggregateType<T>>

    /**
     * Group by Population.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PopulationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PopulationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PopulationGroupByArgs['orderBy'] }
        : { orderBy?: PopulationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PopulationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPopulationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Population model
   */
  readonly fields: PopulationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Population.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PopulationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    maps<T extends MapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MapDefaultArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Population model
   */
  interface PopulationFieldRefs {
    readonly id: FieldRef<"Population", 'String'>
    readonly name: FieldRef<"Population", 'String'>
    readonly description: FieldRef<"Population", 'String'>
    readonly map: FieldRef<"Population", 'String'>
    readonly createdAt: FieldRef<"Population", 'DateTime'>
    readonly updatedAt: FieldRef<"Population", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Population findUnique
   */
  export type PopulationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationInclude<ExtArgs> | null
    /**
     * Filter, which Population to fetch.
     */
    where: PopulationWhereUniqueInput
  }

  /**
   * Population findUniqueOrThrow
   */
  export type PopulationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationInclude<ExtArgs> | null
    /**
     * Filter, which Population to fetch.
     */
    where: PopulationWhereUniqueInput
  }

  /**
   * Population findFirst
   */
  export type PopulationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationInclude<ExtArgs> | null
    /**
     * Filter, which Population to fetch.
     */
    where?: PopulationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Populations to fetch.
     */
    orderBy?: PopulationOrderByWithRelationInput | PopulationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Populations.
     */
    cursor?: PopulationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Populations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Populations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Populations.
     */
    distinct?: PopulationScalarFieldEnum | PopulationScalarFieldEnum[]
  }

  /**
   * Population findFirstOrThrow
   */
  export type PopulationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationInclude<ExtArgs> | null
    /**
     * Filter, which Population to fetch.
     */
    where?: PopulationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Populations to fetch.
     */
    orderBy?: PopulationOrderByWithRelationInput | PopulationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Populations.
     */
    cursor?: PopulationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Populations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Populations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Populations.
     */
    distinct?: PopulationScalarFieldEnum | PopulationScalarFieldEnum[]
  }

  /**
   * Population findMany
   */
  export type PopulationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationInclude<ExtArgs> | null
    /**
     * Filter, which Populations to fetch.
     */
    where?: PopulationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Populations to fetch.
     */
    orderBy?: PopulationOrderByWithRelationInput | PopulationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Populations.
     */
    cursor?: PopulationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Populations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Populations.
     */
    skip?: number
    distinct?: PopulationScalarFieldEnum | PopulationScalarFieldEnum[]
  }

  /**
   * Population create
   */
  export type PopulationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationInclude<ExtArgs> | null
    /**
     * The data needed to create a Population.
     */
    data: XOR<PopulationCreateInput, PopulationUncheckedCreateInput>
  }

  /**
   * Population createMany
   */
  export type PopulationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Populations.
     */
    data: PopulationCreateManyInput | PopulationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Population createManyAndReturn
   */
  export type PopulationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * The data used to create many Populations.
     */
    data: PopulationCreateManyInput | PopulationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Population update
   */
  export type PopulationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationInclude<ExtArgs> | null
    /**
     * The data needed to update a Population.
     */
    data: XOR<PopulationUpdateInput, PopulationUncheckedUpdateInput>
    /**
     * Choose, which Population to update.
     */
    where: PopulationWhereUniqueInput
  }

  /**
   * Population updateMany
   */
  export type PopulationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Populations.
     */
    data: XOR<PopulationUpdateManyMutationInput, PopulationUncheckedUpdateManyInput>
    /**
     * Filter which Populations to update
     */
    where?: PopulationWhereInput
    /**
     * Limit how many Populations to update.
     */
    limit?: number
  }

  /**
   * Population updateManyAndReturn
   */
  export type PopulationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * The data used to update Populations.
     */
    data: XOR<PopulationUpdateManyMutationInput, PopulationUncheckedUpdateManyInput>
    /**
     * Filter which Populations to update
     */
    where?: PopulationWhereInput
    /**
     * Limit how many Populations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Population upsert
   */
  export type PopulationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationInclude<ExtArgs> | null
    /**
     * The filter to search for the Population to update in case it exists.
     */
    where: PopulationWhereUniqueInput
    /**
     * In case the Population found by the `where` argument doesn't exist, create a new Population with this data.
     */
    create: XOR<PopulationCreateInput, PopulationUncheckedCreateInput>
    /**
     * In case the Population was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PopulationUpdateInput, PopulationUncheckedUpdateInput>
  }

  /**
   * Population delete
   */
  export type PopulationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationInclude<ExtArgs> | null
    /**
     * Filter which Population to delete.
     */
    where: PopulationWhereUniqueInput
  }

  /**
   * Population deleteMany
   */
  export type PopulationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Populations to delete
     */
    where?: PopulationWhereInput
    /**
     * Limit how many Populations to delete.
     */
    limit?: number
  }

  /**
   * Population without action
   */
  export type PopulationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Population
     */
    select?: PopulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Population
     */
    omit?: PopulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PopulationInclude<ExtArgs> | null
  }


  /**
   * Model Culture
   */

  export type AggregateCulture = {
    _count: CultureCountAggregateOutputType | null
    _min: CultureMinAggregateOutputType | null
    _max: CultureMaxAggregateOutputType | null
  }

  export type CultureMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    map: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CultureMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    map: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CultureCountAggregateOutputType = {
    id: number
    name: number
    description: number
    map: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CultureMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CultureMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CultureCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    map?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CultureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Culture to aggregate.
     */
    where?: CultureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cultures to fetch.
     */
    orderBy?: CultureOrderByWithRelationInput | CultureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CultureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cultures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cultures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cultures
    **/
    _count?: true | CultureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CultureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CultureMaxAggregateInputType
  }

  export type GetCultureAggregateType<T extends CultureAggregateArgs> = {
        [P in keyof T & keyof AggregateCulture]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCulture[P]>
      : GetScalarType<T[P], AggregateCulture[P]>
  }




  export type CultureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CultureWhereInput
    orderBy?: CultureOrderByWithAggregationInput | CultureOrderByWithAggregationInput[]
    by: CultureScalarFieldEnum[] | CultureScalarFieldEnum
    having?: CultureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CultureCountAggregateInputType | true
    _min?: CultureMinAggregateInputType
    _max?: CultureMaxAggregateInputType
  }

  export type CultureGroupByOutputType = {
    id: string
    name: string
    description: string | null
    map: string
    createdAt: Date | null
    updatedAt: Date | null
    _count: CultureCountAggregateOutputType | null
    _min: CultureMinAggregateOutputType | null
    _max: CultureMaxAggregateOutputType | null
  }

  type GetCultureGroupByPayload<T extends CultureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CultureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CultureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CultureGroupByOutputType[P]>
            : GetScalarType<T[P], CultureGroupByOutputType[P]>
        }
      >
    >


  export type CultureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["culture"]>

  export type CultureSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["culture"]>

  export type CultureSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["culture"]>

  export type CultureSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    map?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CultureOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "map" | "createdAt" | "updatedAt", ExtArgs["result"]["culture"]>
  export type CultureInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }
  export type CultureIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }
  export type CultureIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    maps?: boolean | MapDefaultArgs<ExtArgs>
  }

  export type $CulturePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Culture"
    objects: {
      maps: Prisma.$MapPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      map: string
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["culture"]>
    composites: {}
  }

  type CultureGetPayload<S extends boolean | null | undefined | CultureDefaultArgs> = $Result.GetResult<Prisma.$CulturePayload, S>

  type CultureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CultureFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CultureCountAggregateInputType | true
    }

  export interface CultureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Culture'], meta: { name: 'Culture' } }
    /**
     * Find zero or one Culture that matches the filter.
     * @param {CultureFindUniqueArgs} args - Arguments to find a Culture
     * @example
     * // Get one Culture
     * const culture = await prisma.culture.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CultureFindUniqueArgs>(args: SelectSubset<T, CultureFindUniqueArgs<ExtArgs>>): Prisma__CultureClient<$Result.GetResult<Prisma.$CulturePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Culture that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CultureFindUniqueOrThrowArgs} args - Arguments to find a Culture
     * @example
     * // Get one Culture
     * const culture = await prisma.culture.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CultureFindUniqueOrThrowArgs>(args: SelectSubset<T, CultureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CultureClient<$Result.GetResult<Prisma.$CulturePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Culture that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CultureFindFirstArgs} args - Arguments to find a Culture
     * @example
     * // Get one Culture
     * const culture = await prisma.culture.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CultureFindFirstArgs>(args?: SelectSubset<T, CultureFindFirstArgs<ExtArgs>>): Prisma__CultureClient<$Result.GetResult<Prisma.$CulturePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Culture that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CultureFindFirstOrThrowArgs} args - Arguments to find a Culture
     * @example
     * // Get one Culture
     * const culture = await prisma.culture.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CultureFindFirstOrThrowArgs>(args?: SelectSubset<T, CultureFindFirstOrThrowArgs<ExtArgs>>): Prisma__CultureClient<$Result.GetResult<Prisma.$CulturePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cultures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CultureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cultures
     * const cultures = await prisma.culture.findMany()
     * 
     * // Get first 10 Cultures
     * const cultures = await prisma.culture.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cultureWithIdOnly = await prisma.culture.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CultureFindManyArgs>(args?: SelectSubset<T, CultureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CulturePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Culture.
     * @param {CultureCreateArgs} args - Arguments to create a Culture.
     * @example
     * // Create one Culture
     * const Culture = await prisma.culture.create({
     *   data: {
     *     // ... data to create a Culture
     *   }
     * })
     * 
     */
    create<T extends CultureCreateArgs>(args: SelectSubset<T, CultureCreateArgs<ExtArgs>>): Prisma__CultureClient<$Result.GetResult<Prisma.$CulturePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cultures.
     * @param {CultureCreateManyArgs} args - Arguments to create many Cultures.
     * @example
     * // Create many Cultures
     * const culture = await prisma.culture.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CultureCreateManyArgs>(args?: SelectSubset<T, CultureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cultures and returns the data saved in the database.
     * @param {CultureCreateManyAndReturnArgs} args - Arguments to create many Cultures.
     * @example
     * // Create many Cultures
     * const culture = await prisma.culture.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cultures and only return the `id`
     * const cultureWithIdOnly = await prisma.culture.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CultureCreateManyAndReturnArgs>(args?: SelectSubset<T, CultureCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CulturePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Culture.
     * @param {CultureDeleteArgs} args - Arguments to delete one Culture.
     * @example
     * // Delete one Culture
     * const Culture = await prisma.culture.delete({
     *   where: {
     *     // ... filter to delete one Culture
     *   }
     * })
     * 
     */
    delete<T extends CultureDeleteArgs>(args: SelectSubset<T, CultureDeleteArgs<ExtArgs>>): Prisma__CultureClient<$Result.GetResult<Prisma.$CulturePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Culture.
     * @param {CultureUpdateArgs} args - Arguments to update one Culture.
     * @example
     * // Update one Culture
     * const culture = await prisma.culture.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CultureUpdateArgs>(args: SelectSubset<T, CultureUpdateArgs<ExtArgs>>): Prisma__CultureClient<$Result.GetResult<Prisma.$CulturePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cultures.
     * @param {CultureDeleteManyArgs} args - Arguments to filter Cultures to delete.
     * @example
     * // Delete a few Cultures
     * const { count } = await prisma.culture.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CultureDeleteManyArgs>(args?: SelectSubset<T, CultureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cultures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CultureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cultures
     * const culture = await prisma.culture.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CultureUpdateManyArgs>(args: SelectSubset<T, CultureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cultures and returns the data updated in the database.
     * @param {CultureUpdateManyAndReturnArgs} args - Arguments to update many Cultures.
     * @example
     * // Update many Cultures
     * const culture = await prisma.culture.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Cultures and only return the `id`
     * const cultureWithIdOnly = await prisma.culture.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CultureUpdateManyAndReturnArgs>(args: SelectSubset<T, CultureUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CulturePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Culture.
     * @param {CultureUpsertArgs} args - Arguments to update or create a Culture.
     * @example
     * // Update or create a Culture
     * const culture = await prisma.culture.upsert({
     *   create: {
     *     // ... data to create a Culture
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Culture we want to update
     *   }
     * })
     */
    upsert<T extends CultureUpsertArgs>(args: SelectSubset<T, CultureUpsertArgs<ExtArgs>>): Prisma__CultureClient<$Result.GetResult<Prisma.$CulturePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cultures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CultureCountArgs} args - Arguments to filter Cultures to count.
     * @example
     * // Count the number of Cultures
     * const count = await prisma.culture.count({
     *   where: {
     *     // ... the filter for the Cultures we want to count
     *   }
     * })
    **/
    count<T extends CultureCountArgs>(
      args?: Subset<T, CultureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CultureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Culture.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CultureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CultureAggregateArgs>(args: Subset<T, CultureAggregateArgs>): Prisma.PrismaPromise<GetCultureAggregateType<T>>

    /**
     * Group by Culture.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CultureGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CultureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CultureGroupByArgs['orderBy'] }
        : { orderBy?: CultureGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CultureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCultureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Culture model
   */
  readonly fields: CultureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Culture.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CultureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    maps<T extends MapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MapDefaultArgs<ExtArgs>>): Prisma__MapClient<$Result.GetResult<Prisma.$MapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Culture model
   */
  interface CultureFieldRefs {
    readonly id: FieldRef<"Culture", 'String'>
    readonly name: FieldRef<"Culture", 'String'>
    readonly description: FieldRef<"Culture", 'String'>
    readonly map: FieldRef<"Culture", 'String'>
    readonly createdAt: FieldRef<"Culture", 'DateTime'>
    readonly updatedAt: FieldRef<"Culture", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Culture findUnique
   */
  export type CultureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureInclude<ExtArgs> | null
    /**
     * Filter, which Culture to fetch.
     */
    where: CultureWhereUniqueInput
  }

  /**
   * Culture findUniqueOrThrow
   */
  export type CultureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureInclude<ExtArgs> | null
    /**
     * Filter, which Culture to fetch.
     */
    where: CultureWhereUniqueInput
  }

  /**
   * Culture findFirst
   */
  export type CultureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureInclude<ExtArgs> | null
    /**
     * Filter, which Culture to fetch.
     */
    where?: CultureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cultures to fetch.
     */
    orderBy?: CultureOrderByWithRelationInput | CultureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cultures.
     */
    cursor?: CultureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cultures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cultures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cultures.
     */
    distinct?: CultureScalarFieldEnum | CultureScalarFieldEnum[]
  }

  /**
   * Culture findFirstOrThrow
   */
  export type CultureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureInclude<ExtArgs> | null
    /**
     * Filter, which Culture to fetch.
     */
    where?: CultureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cultures to fetch.
     */
    orderBy?: CultureOrderByWithRelationInput | CultureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cultures.
     */
    cursor?: CultureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cultures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cultures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cultures.
     */
    distinct?: CultureScalarFieldEnum | CultureScalarFieldEnum[]
  }

  /**
   * Culture findMany
   */
  export type CultureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureInclude<ExtArgs> | null
    /**
     * Filter, which Cultures to fetch.
     */
    where?: CultureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cultures to fetch.
     */
    orderBy?: CultureOrderByWithRelationInput | CultureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cultures.
     */
    cursor?: CultureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cultures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cultures.
     */
    skip?: number
    distinct?: CultureScalarFieldEnum | CultureScalarFieldEnum[]
  }

  /**
   * Culture create
   */
  export type CultureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureInclude<ExtArgs> | null
    /**
     * The data needed to create a Culture.
     */
    data: XOR<CultureCreateInput, CultureUncheckedCreateInput>
  }

  /**
   * Culture createMany
   */
  export type CultureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cultures.
     */
    data: CultureCreateManyInput | CultureCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Culture createManyAndReturn
   */
  export type CultureCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * The data used to create many Cultures.
     */
    data: CultureCreateManyInput | CultureCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Culture update
   */
  export type CultureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureInclude<ExtArgs> | null
    /**
     * The data needed to update a Culture.
     */
    data: XOR<CultureUpdateInput, CultureUncheckedUpdateInput>
    /**
     * Choose, which Culture to update.
     */
    where: CultureWhereUniqueInput
  }

  /**
   * Culture updateMany
   */
  export type CultureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cultures.
     */
    data: XOR<CultureUpdateManyMutationInput, CultureUncheckedUpdateManyInput>
    /**
     * Filter which Cultures to update
     */
    where?: CultureWhereInput
    /**
     * Limit how many Cultures to update.
     */
    limit?: number
  }

  /**
   * Culture updateManyAndReturn
   */
  export type CultureUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * The data used to update Cultures.
     */
    data: XOR<CultureUpdateManyMutationInput, CultureUncheckedUpdateManyInput>
    /**
     * Filter which Cultures to update
     */
    where?: CultureWhereInput
    /**
     * Limit how many Cultures to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Culture upsert
   */
  export type CultureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureInclude<ExtArgs> | null
    /**
     * The filter to search for the Culture to update in case it exists.
     */
    where: CultureWhereUniqueInput
    /**
     * In case the Culture found by the `where` argument doesn't exist, create a new Culture with this data.
     */
    create: XOR<CultureCreateInput, CultureUncheckedCreateInput>
    /**
     * In case the Culture was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CultureUpdateInput, CultureUncheckedUpdateInput>
  }

  /**
   * Culture delete
   */
  export type CultureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureInclude<ExtArgs> | null
    /**
     * Filter which Culture to delete.
     */
    where: CultureWhereUniqueInput
  }

  /**
   * Culture deleteMany
   */
  export type CultureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cultures to delete
     */
    where?: CultureWhereInput
    /**
     * Limit how many Cultures to delete.
     */
    limit?: number
  }

  /**
   * Culture without action
   */
  export type CultureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Culture
     */
    select?: CultureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Culture
     */
    omit?: CultureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CultureInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    username: 'username',
    displayUsername: 'displayUsername',
    isAnonymous: 'isAnonymous',
    role: 'role',
    banned: 'banned',
    banReason: 'banReason',
    banExpires: 'banExpires'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    expiresAt: 'expiresAt',
    token: 'token',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    userId: 'userId',
    impersonatedBy: 'impersonatedBy'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    providerId: 'providerId',
    userId: 'userId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    idToken: 'idToken',
    accessTokenExpiresAt: 'accessTokenExpiresAt',
    refreshTokenExpiresAt: 'refreshTokenExpiresAt',
    scope: 'scope',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const VerificationScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    value: 'value',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum]


  export const MapScalarFieldEnum: {
    id: 'id',
    name: 'name',
    url: 'url',
    description: 'description',
    owner: 'owner',
    createdAt: 'createdAt',
    updateAt: 'updateAt'
  };

  export type MapScalarFieldEnum = (typeof MapScalarFieldEnum)[keyof typeof MapScalarFieldEnum]


  export const CountryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    area: 'area',
    description: 'description',
    map: 'map',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CountryScalarFieldEnum = (typeof CountryScalarFieldEnum)[keyof typeof CountryScalarFieldEnum]


  export const TownScalarFieldEnum: {
    id: 'id',
    name: 'name',
    icon: 'icon',
    description: 'description',
    map: 'map',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TownScalarFieldEnum = (typeof TownScalarFieldEnum)[keyof typeof TownScalarFieldEnum]


  export const VillageScalarFieldEnum: {
    id: 'id',
    name: 'name',
    icon: 'icon',
    description: 'description',
    map: 'map',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VillageScalarFieldEnum = (typeof VillageScalarFieldEnum)[keyof typeof VillageScalarFieldEnum]


  export const PointOfInterestScalarFieldEnum: {
    id: 'id',
    name: 'name',
    icon: 'icon',
    description: 'description',
    map: 'map',
    town: 'town',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PointOfInterestScalarFieldEnum = (typeof PointOfInterestScalarFieldEnum)[keyof typeof PointOfInterestScalarFieldEnum]


  export const PopulationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    map: 'map',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PopulationScalarFieldEnum = (typeof PopulationScalarFieldEnum)[keyof typeof PopulationScalarFieldEnum]


  export const CultureScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    map: 'map',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CultureScalarFieldEnum = (typeof CultureScalarFieldEnum)[keyof typeof CultureScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    username?: StringNullableFilter<"User"> | string | null
    displayUsername?: StringNullableFilter<"User"> | string | null
    isAnonymous?: BoolNullableFilter<"User"> | boolean | null
    role?: StringNullableFilter<"User"> | string | null
    banned?: BoolNullableFilter<"User"> | boolean | null
    banReason?: StringNullableFilter<"User"> | string | null
    banExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    maps?: MapListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    username?: SortOrderInput | SortOrder
    displayUsername?: SortOrderInput | SortOrder
    isAnonymous?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    banned?: SortOrderInput | SortOrder
    banReason?: SortOrderInput | SortOrder
    banExpires?: SortOrderInput | SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    maps?: MapOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    displayUsername?: StringNullableFilter<"User"> | string | null
    isAnonymous?: BoolNullableFilter<"User"> | boolean | null
    role?: StringNullableFilter<"User"> | string | null
    banned?: BoolNullableFilter<"User"> | boolean | null
    banReason?: StringNullableFilter<"User"> | string | null
    banExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    maps?: MapListRelationFilter
  }, "id" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    username?: SortOrderInput | SortOrder
    displayUsername?: SortOrderInput | SortOrder
    isAnonymous?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    banned?: SortOrderInput | SortOrder
    banReason?: SortOrderInput | SortOrder
    banExpires?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    displayUsername?: StringNullableWithAggregatesFilter<"User"> | string | null
    isAnonymous?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    role?: StringNullableWithAggregatesFilter<"User"> | string | null
    banned?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    banReason?: StringNullableWithAggregatesFilter<"User"> | string | null
    banExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    impersonatedBy?: StringNullableFilter<"Session"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    impersonatedBy?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    impersonatedBy?: StringNullableFilter<"Session"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    impersonatedBy?: SortOrderInput | SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    token?: StringWithAggregatesFilter<"Session"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userId?: StringWithAggregatesFilter<"Session"> | string
    impersonatedBy?: StringNullableWithAggregatesFilter<"Session"> | string | null
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    accountId?: StringWithAggregatesFilter<"Account"> | string
    providerId?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    password?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type VerificationWhereInput = {
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    id?: StringFilter<"Verification"> | string
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
  }

  export type VerificationOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
  }

  export type VerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
  }, "id">

  export type VerificationOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: VerificationCountOrderByAggregateInput
    _max?: VerificationMaxOrderByAggregateInput
    _min?: VerificationMinOrderByAggregateInput
  }

  export type VerificationScalarWhereWithAggregatesInput = {
    AND?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    OR?: VerificationScalarWhereWithAggregatesInput[]
    NOT?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Verification"> | string
    identifier?: StringWithAggregatesFilter<"Verification"> | string
    value?: StringWithAggregatesFilter<"Verification"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"Verification"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Verification"> | Date | string | null
  }

  export type MapWhereInput = {
    AND?: MapWhereInput | MapWhereInput[]
    OR?: MapWhereInput[]
    NOT?: MapWhereInput | MapWhereInput[]
    id?: StringFilter<"Map"> | string
    name?: StringFilter<"Map"> | string
    url?: StringFilter<"Map"> | string
    description?: StringNullableFilter<"Map"> | string | null
    owner?: StringFilter<"Map"> | string
    createdAt?: DateTimeNullableFilter<"Map"> | Date | string | null
    updateAt?: DateTimeNullableFilter<"Map"> | Date | string | null
    countries?: CountryListRelationFilter
    towns?: TownListRelationFilter
    villages?: VillageListRelationFilter
    poi?: PointOfInterestListRelationFilter
    population?: PopulationListRelationFilter
    culture?: CultureListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MapOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    description?: SortOrderInput | SortOrder
    owner?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updateAt?: SortOrderInput | SortOrder
    countries?: CountryOrderByRelationAggregateInput
    towns?: TownOrderByRelationAggregateInput
    villages?: VillageOrderByRelationAggregateInput
    poi?: PointOfInterestOrderByRelationAggregateInput
    population?: PopulationOrderByRelationAggregateInput
    culture?: CultureOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
  }

  export type MapWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MapWhereInput | MapWhereInput[]
    OR?: MapWhereInput[]
    NOT?: MapWhereInput | MapWhereInput[]
    name?: StringFilter<"Map"> | string
    url?: StringFilter<"Map"> | string
    description?: StringNullableFilter<"Map"> | string | null
    owner?: StringFilter<"Map"> | string
    createdAt?: DateTimeNullableFilter<"Map"> | Date | string | null
    updateAt?: DateTimeNullableFilter<"Map"> | Date | string | null
    countries?: CountryListRelationFilter
    towns?: TownListRelationFilter
    villages?: VillageListRelationFilter
    poi?: PointOfInterestListRelationFilter
    population?: PopulationListRelationFilter
    culture?: CultureListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "id">

  export type MapOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    description?: SortOrderInput | SortOrder
    owner?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updateAt?: SortOrderInput | SortOrder
    _count?: MapCountOrderByAggregateInput
    _max?: MapMaxOrderByAggregateInput
    _min?: MapMinOrderByAggregateInput
  }

  export type MapScalarWhereWithAggregatesInput = {
    AND?: MapScalarWhereWithAggregatesInput | MapScalarWhereWithAggregatesInput[]
    OR?: MapScalarWhereWithAggregatesInput[]
    NOT?: MapScalarWhereWithAggregatesInput | MapScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Map"> | string
    name?: StringWithAggregatesFilter<"Map"> | string
    url?: StringWithAggregatesFilter<"Map"> | string
    description?: StringNullableWithAggregatesFilter<"Map"> | string | null
    owner?: StringWithAggregatesFilter<"Map"> | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"Map"> | Date | string | null
    updateAt?: DateTimeNullableWithAggregatesFilter<"Map"> | Date | string | null
  }

  export type CountryWhereInput = {
    AND?: CountryWhereInput | CountryWhereInput[]
    OR?: CountryWhereInput[]
    NOT?: CountryWhereInput | CountryWhereInput[]
    id?: StringFilter<"Country"> | string
    name?: StringFilter<"Country"> | string
    area?: StringFilter<"Country"> | string
    description?: StringNullableFilter<"Country"> | string | null
    map?: StringFilter<"Country"> | string
    createdAt?: DateTimeNullableFilter<"Country"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Country"> | Date | string | null
    maps?: XOR<MapScalarRelationFilter, MapWhereInput>
  }

  export type CountryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    area?: SortOrder
    description?: SortOrderInput | SortOrder
    map?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    maps?: MapOrderByWithRelationInput
  }

  export type CountryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CountryWhereInput | CountryWhereInput[]
    OR?: CountryWhereInput[]
    NOT?: CountryWhereInput | CountryWhereInput[]
    name?: StringFilter<"Country"> | string
    area?: StringFilter<"Country"> | string
    description?: StringNullableFilter<"Country"> | string | null
    map?: StringFilter<"Country"> | string
    createdAt?: DateTimeNullableFilter<"Country"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Country"> | Date | string | null
    maps?: XOR<MapScalarRelationFilter, MapWhereInput>
  }, "id">

  export type CountryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    area?: SortOrder
    description?: SortOrderInput | SortOrder
    map?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: CountryCountOrderByAggregateInput
    _max?: CountryMaxOrderByAggregateInput
    _min?: CountryMinOrderByAggregateInput
  }

  export type CountryScalarWhereWithAggregatesInput = {
    AND?: CountryScalarWhereWithAggregatesInput | CountryScalarWhereWithAggregatesInput[]
    OR?: CountryScalarWhereWithAggregatesInput[]
    NOT?: CountryScalarWhereWithAggregatesInput | CountryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Country"> | string
    name?: StringWithAggregatesFilter<"Country"> | string
    area?: StringWithAggregatesFilter<"Country"> | string
    description?: StringNullableWithAggregatesFilter<"Country"> | string | null
    map?: StringWithAggregatesFilter<"Country"> | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"Country"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Country"> | Date | string | null
  }

  export type TownWhereInput = {
    AND?: TownWhereInput | TownWhereInput[]
    OR?: TownWhereInput[]
    NOT?: TownWhereInput | TownWhereInput[]
    id?: StringFilter<"Town"> | string
    name?: StringFilter<"Town"> | string
    icon?: StringFilter<"Town"> | string
    description?: StringNullableFilter<"Town"> | string | null
    map?: StringFilter<"Town"> | string
    createdAt?: DateTimeNullableFilter<"Town"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Town"> | Date | string | null
    maps?: XOR<MapScalarRelationFilter, MapWhereInput>
    poi?: PointOfInterestListRelationFilter
  }

  export type TownOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrderInput | SortOrder
    map?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    maps?: MapOrderByWithRelationInput
    poi?: PointOfInterestOrderByRelationAggregateInput
  }

  export type TownWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TownWhereInput | TownWhereInput[]
    OR?: TownWhereInput[]
    NOT?: TownWhereInput | TownWhereInput[]
    name?: StringFilter<"Town"> | string
    icon?: StringFilter<"Town"> | string
    description?: StringNullableFilter<"Town"> | string | null
    map?: StringFilter<"Town"> | string
    createdAt?: DateTimeNullableFilter<"Town"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Town"> | Date | string | null
    maps?: XOR<MapScalarRelationFilter, MapWhereInput>
    poi?: PointOfInterestListRelationFilter
  }, "id">

  export type TownOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrderInput | SortOrder
    map?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: TownCountOrderByAggregateInput
    _max?: TownMaxOrderByAggregateInput
    _min?: TownMinOrderByAggregateInput
  }

  export type TownScalarWhereWithAggregatesInput = {
    AND?: TownScalarWhereWithAggregatesInput | TownScalarWhereWithAggregatesInput[]
    OR?: TownScalarWhereWithAggregatesInput[]
    NOT?: TownScalarWhereWithAggregatesInput | TownScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Town"> | string
    name?: StringWithAggregatesFilter<"Town"> | string
    icon?: StringWithAggregatesFilter<"Town"> | string
    description?: StringNullableWithAggregatesFilter<"Town"> | string | null
    map?: StringWithAggregatesFilter<"Town"> | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"Town"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Town"> | Date | string | null
  }

  export type VillageWhereInput = {
    AND?: VillageWhereInput | VillageWhereInput[]
    OR?: VillageWhereInput[]
    NOT?: VillageWhereInput | VillageWhereInput[]
    id?: StringFilter<"Village"> | string
    name?: StringFilter<"Village"> | string
    icon?: StringFilter<"Village"> | string
    description?: StringNullableFilter<"Village"> | string | null
    map?: StringFilter<"Village"> | string
    createdAt?: DateTimeNullableFilter<"Village"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Village"> | Date | string | null
    maps?: XOR<MapScalarRelationFilter, MapWhereInput>
  }

  export type VillageOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrderInput | SortOrder
    map?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    maps?: MapOrderByWithRelationInput
  }

  export type VillageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VillageWhereInput | VillageWhereInput[]
    OR?: VillageWhereInput[]
    NOT?: VillageWhereInput | VillageWhereInput[]
    name?: StringFilter<"Village"> | string
    icon?: StringFilter<"Village"> | string
    description?: StringNullableFilter<"Village"> | string | null
    map?: StringFilter<"Village"> | string
    createdAt?: DateTimeNullableFilter<"Village"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Village"> | Date | string | null
    maps?: XOR<MapScalarRelationFilter, MapWhereInput>
  }, "id">

  export type VillageOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrderInput | SortOrder
    map?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: VillageCountOrderByAggregateInput
    _max?: VillageMaxOrderByAggregateInput
    _min?: VillageMinOrderByAggregateInput
  }

  export type VillageScalarWhereWithAggregatesInput = {
    AND?: VillageScalarWhereWithAggregatesInput | VillageScalarWhereWithAggregatesInput[]
    OR?: VillageScalarWhereWithAggregatesInput[]
    NOT?: VillageScalarWhereWithAggregatesInput | VillageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Village"> | string
    name?: StringWithAggregatesFilter<"Village"> | string
    icon?: StringWithAggregatesFilter<"Village"> | string
    description?: StringNullableWithAggregatesFilter<"Village"> | string | null
    map?: StringWithAggregatesFilter<"Village"> | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"Village"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Village"> | Date | string | null
  }

  export type PointOfInterestWhereInput = {
    AND?: PointOfInterestWhereInput | PointOfInterestWhereInput[]
    OR?: PointOfInterestWhereInput[]
    NOT?: PointOfInterestWhereInput | PointOfInterestWhereInput[]
    id?: StringFilter<"PointOfInterest"> | string
    name?: StringFilter<"PointOfInterest"> | string
    icon?: StringFilter<"PointOfInterest"> | string
    description?: StringNullableFilter<"PointOfInterest"> | string | null
    map?: StringFilter<"PointOfInterest"> | string
    town?: StringFilter<"PointOfInterest"> | string
    createdAt?: DateTimeNullableFilter<"PointOfInterest"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"PointOfInterest"> | Date | string | null
    maps?: XOR<MapScalarRelationFilter, MapWhereInput>
    towns?: XOR<TownScalarRelationFilter, TownWhereInput>
  }

  export type PointOfInterestOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrderInput | SortOrder
    map?: SortOrder
    town?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    maps?: MapOrderByWithRelationInput
    towns?: TownOrderByWithRelationInput
  }

  export type PointOfInterestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PointOfInterestWhereInput | PointOfInterestWhereInput[]
    OR?: PointOfInterestWhereInput[]
    NOT?: PointOfInterestWhereInput | PointOfInterestWhereInput[]
    name?: StringFilter<"PointOfInterest"> | string
    icon?: StringFilter<"PointOfInterest"> | string
    description?: StringNullableFilter<"PointOfInterest"> | string | null
    map?: StringFilter<"PointOfInterest"> | string
    town?: StringFilter<"PointOfInterest"> | string
    createdAt?: DateTimeNullableFilter<"PointOfInterest"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"PointOfInterest"> | Date | string | null
    maps?: XOR<MapScalarRelationFilter, MapWhereInput>
    towns?: XOR<TownScalarRelationFilter, TownWhereInput>
  }, "id">

  export type PointOfInterestOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrderInput | SortOrder
    map?: SortOrder
    town?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: PointOfInterestCountOrderByAggregateInput
    _max?: PointOfInterestMaxOrderByAggregateInput
    _min?: PointOfInterestMinOrderByAggregateInput
  }

  export type PointOfInterestScalarWhereWithAggregatesInput = {
    AND?: PointOfInterestScalarWhereWithAggregatesInput | PointOfInterestScalarWhereWithAggregatesInput[]
    OR?: PointOfInterestScalarWhereWithAggregatesInput[]
    NOT?: PointOfInterestScalarWhereWithAggregatesInput | PointOfInterestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PointOfInterest"> | string
    name?: StringWithAggregatesFilter<"PointOfInterest"> | string
    icon?: StringWithAggregatesFilter<"PointOfInterest"> | string
    description?: StringNullableWithAggregatesFilter<"PointOfInterest"> | string | null
    map?: StringWithAggregatesFilter<"PointOfInterest"> | string
    town?: StringWithAggregatesFilter<"PointOfInterest"> | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"PointOfInterest"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"PointOfInterest"> | Date | string | null
  }

  export type PopulationWhereInput = {
    AND?: PopulationWhereInput | PopulationWhereInput[]
    OR?: PopulationWhereInput[]
    NOT?: PopulationWhereInput | PopulationWhereInput[]
    id?: StringFilter<"Population"> | string
    name?: StringFilter<"Population"> | string
    description?: StringNullableFilter<"Population"> | string | null
    map?: StringFilter<"Population"> | string
    createdAt?: DateTimeNullableFilter<"Population"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Population"> | Date | string | null
    maps?: XOR<MapScalarRelationFilter, MapWhereInput>
  }

  export type PopulationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    map?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    maps?: MapOrderByWithRelationInput
  }

  export type PopulationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PopulationWhereInput | PopulationWhereInput[]
    OR?: PopulationWhereInput[]
    NOT?: PopulationWhereInput | PopulationWhereInput[]
    name?: StringFilter<"Population"> | string
    description?: StringNullableFilter<"Population"> | string | null
    map?: StringFilter<"Population"> | string
    createdAt?: DateTimeNullableFilter<"Population"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Population"> | Date | string | null
    maps?: XOR<MapScalarRelationFilter, MapWhereInput>
  }, "id" | "id">

  export type PopulationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    map?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: PopulationCountOrderByAggregateInput
    _max?: PopulationMaxOrderByAggregateInput
    _min?: PopulationMinOrderByAggregateInput
  }

  export type PopulationScalarWhereWithAggregatesInput = {
    AND?: PopulationScalarWhereWithAggregatesInput | PopulationScalarWhereWithAggregatesInput[]
    OR?: PopulationScalarWhereWithAggregatesInput[]
    NOT?: PopulationScalarWhereWithAggregatesInput | PopulationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Population"> | string
    name?: StringWithAggregatesFilter<"Population"> | string
    description?: StringNullableWithAggregatesFilter<"Population"> | string | null
    map?: StringWithAggregatesFilter<"Population"> | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"Population"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Population"> | Date | string | null
  }

  export type CultureWhereInput = {
    AND?: CultureWhereInput | CultureWhereInput[]
    OR?: CultureWhereInput[]
    NOT?: CultureWhereInput | CultureWhereInput[]
    id?: StringFilter<"Culture"> | string
    name?: StringFilter<"Culture"> | string
    description?: StringNullableFilter<"Culture"> | string | null
    map?: StringFilter<"Culture"> | string
    createdAt?: DateTimeNullableFilter<"Culture"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Culture"> | Date | string | null
    maps?: XOR<MapScalarRelationFilter, MapWhereInput>
  }

  export type CultureOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    map?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    maps?: MapOrderByWithRelationInput
  }

  export type CultureWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CultureWhereInput | CultureWhereInput[]
    OR?: CultureWhereInput[]
    NOT?: CultureWhereInput | CultureWhereInput[]
    name?: StringFilter<"Culture"> | string
    description?: StringNullableFilter<"Culture"> | string | null
    map?: StringFilter<"Culture"> | string
    createdAt?: DateTimeNullableFilter<"Culture"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Culture"> | Date | string | null
    maps?: XOR<MapScalarRelationFilter, MapWhereInput>
  }, "id">

  export type CultureOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    map?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: CultureCountOrderByAggregateInput
    _max?: CultureMaxOrderByAggregateInput
    _min?: CultureMinOrderByAggregateInput
  }

  export type CultureScalarWhereWithAggregatesInput = {
    AND?: CultureScalarWhereWithAggregatesInput | CultureScalarWhereWithAggregatesInput[]
    OR?: CultureScalarWhereWithAggregatesInput[]
    NOT?: CultureScalarWhereWithAggregatesInput | CultureScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Culture"> | string
    name?: StringWithAggregatesFilter<"Culture"> | string
    description?: StringNullableWithAggregatesFilter<"Culture"> | string | null
    map?: StringWithAggregatesFilter<"Culture"> | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"Culture"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Culture"> | Date | string | null
  }

  export type UserCreateInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    username?: string | null
    displayUsername?: string | null
    isAnonymous?: boolean | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    maps?: MapCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    username?: string | null
    displayUsername?: string | null
    isAnonymous?: boolean | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    maps?: MapUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayUsername?: NullableStringFieldUpdateOperationsInput | string | null
    isAnonymous?: NullableBoolFieldUpdateOperationsInput | boolean | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    maps?: MapUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayUsername?: NullableStringFieldUpdateOperationsInput | string | null
    isAnonymous?: NullableBoolFieldUpdateOperationsInput | boolean | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    maps?: MapUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    username?: string | null
    displayUsername?: string | null
    isAnonymous?: boolean | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayUsername?: NullableStringFieldUpdateOperationsInput | string | null
    isAnonymous?: NullableBoolFieldUpdateOperationsInput | boolean | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayUsername?: NullableStringFieldUpdateOperationsInput | string | null
    isAnonymous?: NullableBoolFieldUpdateOperationsInput | boolean | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SessionCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
    impersonatedBy?: string | null
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateManyInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
    impersonatedBy?: string | null
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VerificationUncheckedCreateInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VerificationCreateManyInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MapCreateInput = {
    id: string
    name: string
    url: string
    description?: string | null
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryCreateNestedManyWithoutMapsInput
    towns?: TownCreateNestedManyWithoutMapsInput
    villages?: VillageCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestCreateNestedManyWithoutMapsInput
    population?: PopulationCreateNestedManyWithoutMapsInput
    culture?: CultureCreateNestedManyWithoutMapsInput
    user: UserCreateNestedOneWithoutMapsInput
  }

  export type MapUncheckedCreateInput = {
    id: string
    name: string
    url: string
    description?: string | null
    owner: string
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryUncheckedCreateNestedManyWithoutMapsInput
    towns?: TownUncheckedCreateNestedManyWithoutMapsInput
    villages?: VillageUncheckedCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestUncheckedCreateNestedManyWithoutMapsInput
    population?: PopulationUncheckedCreateNestedManyWithoutMapsInput
    culture?: CultureUncheckedCreateNestedManyWithoutMapsInput
  }

  export type MapUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUpdateManyWithoutMapsNestedInput
    towns?: TownUpdateManyWithoutMapsNestedInput
    villages?: VillageUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUpdateManyWithoutMapsNestedInput
    population?: PopulationUpdateManyWithoutMapsNestedInput
    culture?: CultureUpdateManyWithoutMapsNestedInput
    user?: UserUpdateOneRequiredWithoutMapsNestedInput
  }

  export type MapUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUncheckedUpdateManyWithoutMapsNestedInput
    towns?: TownUncheckedUpdateManyWithoutMapsNestedInput
    villages?: VillageUncheckedUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUncheckedUpdateManyWithoutMapsNestedInput
    population?: PopulationUncheckedUpdateManyWithoutMapsNestedInput
    culture?: CultureUncheckedUpdateManyWithoutMapsNestedInput
  }

  export type MapCreateManyInput = {
    id: string
    name: string
    url: string
    description?: string | null
    owner: string
    createdAt?: Date | string | null
    updateAt?: Date | string | null
  }

  export type MapUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MapUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CountryCreateInput = {
    id: string
    name: string
    area: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    maps: MapCreateNestedOneWithoutCountriesInput
  }

  export type CountryUncheckedCreateInput = {
    id: string
    name: string
    area: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type CountryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maps?: MapUpdateOneRequiredWithoutCountriesNestedInput
  }

  export type CountryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CountryCreateManyInput = {
    id: string
    name: string
    area: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type CountryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CountryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TownCreateInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    maps: MapCreateNestedOneWithoutTownsInput
    poi?: PointOfInterestCreateNestedManyWithoutTownsInput
  }

  export type TownUncheckedCreateInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    poi?: PointOfInterestUncheckedCreateNestedManyWithoutTownsInput
  }

  export type TownUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maps?: MapUpdateOneRequiredWithoutTownsNestedInput
    poi?: PointOfInterestUpdateManyWithoutTownsNestedInput
  }

  export type TownUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    poi?: PointOfInterestUncheckedUpdateManyWithoutTownsNestedInput
  }

  export type TownCreateManyInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type TownUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TownUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VillageCreateInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    maps: MapCreateNestedOneWithoutVillagesInput
  }

  export type VillageUncheckedCreateInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VillageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maps?: MapUpdateOneRequiredWithoutVillagesNestedInput
  }

  export type VillageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VillageCreateManyInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VillageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VillageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PointOfInterestCreateInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    maps: MapCreateNestedOneWithoutPoiInput
    towns: TownCreateNestedOneWithoutPoiInput
  }

  export type PointOfInterestUncheckedCreateInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    map: string
    town: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type PointOfInterestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maps?: MapUpdateOneRequiredWithoutPoiNestedInput
    towns?: TownUpdateOneRequiredWithoutPoiNestedInput
  }

  export type PointOfInterestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    town?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PointOfInterestCreateManyInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    map: string
    town: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type PointOfInterestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PointOfInterestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    town?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PopulationCreateInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    maps: MapCreateNestedOneWithoutPopulationInput
  }

  export type PopulationUncheckedCreateInput = {
    id: string
    name: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type PopulationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maps?: MapUpdateOneRequiredWithoutPopulationNestedInput
  }

  export type PopulationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PopulationCreateManyInput = {
    id: string
    name: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type PopulationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PopulationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CultureCreateInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    maps: MapCreateNestedOneWithoutCultureInput
  }

  export type CultureUncheckedCreateInput = {
    id: string
    name: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type CultureUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maps?: MapUpdateOneRequiredWithoutCultureNestedInput
  }

  export type CultureUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CultureCreateManyInput = {
    id: string
    name: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type CultureUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CultureUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type MapListRelationFilter = {
    every?: MapWhereInput
    some?: MapWhereInput
    none?: MapWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MapOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    username?: SortOrder
    displayUsername?: SortOrder
    isAnonymous?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    username?: SortOrder
    displayUsername?: SortOrder
    isAnonymous?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    username?: SortOrder
    displayUsername?: SortOrder
    isAnonymous?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    impersonatedBy?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    impersonatedBy?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    impersonatedBy?: SortOrder
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CountryListRelationFilter = {
    every?: CountryWhereInput
    some?: CountryWhereInput
    none?: CountryWhereInput
  }

  export type TownListRelationFilter = {
    every?: TownWhereInput
    some?: TownWhereInput
    none?: TownWhereInput
  }

  export type VillageListRelationFilter = {
    every?: VillageWhereInput
    some?: VillageWhereInput
    none?: VillageWhereInput
  }

  export type PointOfInterestListRelationFilter = {
    every?: PointOfInterestWhereInput
    some?: PointOfInterestWhereInput
    none?: PointOfInterestWhereInput
  }

  export type PopulationListRelationFilter = {
    every?: PopulationWhereInput
    some?: PopulationWhereInput
    none?: PopulationWhereInput
  }

  export type CultureListRelationFilter = {
    every?: CultureWhereInput
    some?: CultureWhereInput
    none?: CultureWhereInput
  }

  export type CountryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TownOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VillageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PointOfInterestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PopulationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CultureOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MapCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    description?: SortOrder
    owner?: SortOrder
    createdAt?: SortOrder
    updateAt?: SortOrder
  }

  export type MapMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    description?: SortOrder
    owner?: SortOrder
    createdAt?: SortOrder
    updateAt?: SortOrder
  }

  export type MapMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    description?: SortOrder
    owner?: SortOrder
    createdAt?: SortOrder
    updateAt?: SortOrder
  }

  export type MapScalarRelationFilter = {
    is?: MapWhereInput
    isNot?: MapWhereInput
  }

  export type CountryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    area?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CountryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    area?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CountryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    area?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TownCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TownMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TownMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VillageCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VillageMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VillageMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TownScalarRelationFilter = {
    is?: TownWhereInput
    isNot?: TownWhereInput
  }

  export type PointOfInterestCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    map?: SortOrder
    town?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PointOfInterestMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    map?: SortOrder
    town?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PointOfInterestMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    map?: SortOrder
    town?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PopulationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PopulationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PopulationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CultureCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CultureMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CultureMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    map?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type MapCreateNestedManyWithoutUserInput = {
    create?: XOR<MapCreateWithoutUserInput, MapUncheckedCreateWithoutUserInput> | MapCreateWithoutUserInput[] | MapUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MapCreateOrConnectWithoutUserInput | MapCreateOrConnectWithoutUserInput[]
    createMany?: MapCreateManyUserInputEnvelope
    connect?: MapWhereUniqueInput | MapWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type MapUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MapCreateWithoutUserInput, MapUncheckedCreateWithoutUserInput> | MapCreateWithoutUserInput[] | MapUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MapCreateOrConnectWithoutUserInput | MapCreateOrConnectWithoutUserInput[]
    createMany?: MapCreateManyUserInputEnvelope
    connect?: MapWhereUniqueInput | MapWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type MapUpdateManyWithoutUserNestedInput = {
    create?: XOR<MapCreateWithoutUserInput, MapUncheckedCreateWithoutUserInput> | MapCreateWithoutUserInput[] | MapUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MapCreateOrConnectWithoutUserInput | MapCreateOrConnectWithoutUserInput[]
    upsert?: MapUpsertWithWhereUniqueWithoutUserInput | MapUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MapCreateManyUserInputEnvelope
    set?: MapWhereUniqueInput | MapWhereUniqueInput[]
    disconnect?: MapWhereUniqueInput | MapWhereUniqueInput[]
    delete?: MapWhereUniqueInput | MapWhereUniqueInput[]
    connect?: MapWhereUniqueInput | MapWhereUniqueInput[]
    update?: MapUpdateWithWhereUniqueWithoutUserInput | MapUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MapUpdateManyWithWhereWithoutUserInput | MapUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MapScalarWhereInput | MapScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type MapUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MapCreateWithoutUserInput, MapUncheckedCreateWithoutUserInput> | MapCreateWithoutUserInput[] | MapUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MapCreateOrConnectWithoutUserInput | MapCreateOrConnectWithoutUserInput[]
    upsert?: MapUpsertWithWhereUniqueWithoutUserInput | MapUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MapCreateManyUserInputEnvelope
    set?: MapWhereUniqueInput | MapWhereUniqueInput[]
    disconnect?: MapWhereUniqueInput | MapWhereUniqueInput[]
    delete?: MapWhereUniqueInput | MapWhereUniqueInput[]
    connect?: MapWhereUniqueInput | MapWhereUniqueInput[]
    update?: MapUpdateWithWhereUniqueWithoutUserInput | MapUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MapUpdateManyWithWhereWithoutUserInput | MapUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MapScalarWhereInput | MapScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type CountryCreateNestedManyWithoutMapsInput = {
    create?: XOR<CountryCreateWithoutMapsInput, CountryUncheckedCreateWithoutMapsInput> | CountryCreateWithoutMapsInput[] | CountryUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: CountryCreateOrConnectWithoutMapsInput | CountryCreateOrConnectWithoutMapsInput[]
    createMany?: CountryCreateManyMapsInputEnvelope
    connect?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
  }

  export type TownCreateNestedManyWithoutMapsInput = {
    create?: XOR<TownCreateWithoutMapsInput, TownUncheckedCreateWithoutMapsInput> | TownCreateWithoutMapsInput[] | TownUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: TownCreateOrConnectWithoutMapsInput | TownCreateOrConnectWithoutMapsInput[]
    createMany?: TownCreateManyMapsInputEnvelope
    connect?: TownWhereUniqueInput | TownWhereUniqueInput[]
  }

  export type VillageCreateNestedManyWithoutMapsInput = {
    create?: XOR<VillageCreateWithoutMapsInput, VillageUncheckedCreateWithoutMapsInput> | VillageCreateWithoutMapsInput[] | VillageUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: VillageCreateOrConnectWithoutMapsInput | VillageCreateOrConnectWithoutMapsInput[]
    createMany?: VillageCreateManyMapsInputEnvelope
    connect?: VillageWhereUniqueInput | VillageWhereUniqueInput[]
  }

  export type PointOfInterestCreateNestedManyWithoutMapsInput = {
    create?: XOR<PointOfInterestCreateWithoutMapsInput, PointOfInterestUncheckedCreateWithoutMapsInput> | PointOfInterestCreateWithoutMapsInput[] | PointOfInterestUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: PointOfInterestCreateOrConnectWithoutMapsInput | PointOfInterestCreateOrConnectWithoutMapsInput[]
    createMany?: PointOfInterestCreateManyMapsInputEnvelope
    connect?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
  }

  export type PopulationCreateNestedManyWithoutMapsInput = {
    create?: XOR<PopulationCreateWithoutMapsInput, PopulationUncheckedCreateWithoutMapsInput> | PopulationCreateWithoutMapsInput[] | PopulationUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: PopulationCreateOrConnectWithoutMapsInput | PopulationCreateOrConnectWithoutMapsInput[]
    createMany?: PopulationCreateManyMapsInputEnvelope
    connect?: PopulationWhereUniqueInput | PopulationWhereUniqueInput[]
  }

  export type CultureCreateNestedManyWithoutMapsInput = {
    create?: XOR<CultureCreateWithoutMapsInput, CultureUncheckedCreateWithoutMapsInput> | CultureCreateWithoutMapsInput[] | CultureUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: CultureCreateOrConnectWithoutMapsInput | CultureCreateOrConnectWithoutMapsInput[]
    createMany?: CultureCreateManyMapsInputEnvelope
    connect?: CultureWhereUniqueInput | CultureWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutMapsInput = {
    create?: XOR<UserCreateWithoutMapsInput, UserUncheckedCreateWithoutMapsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMapsInput
    connect?: UserWhereUniqueInput
  }

  export type CountryUncheckedCreateNestedManyWithoutMapsInput = {
    create?: XOR<CountryCreateWithoutMapsInput, CountryUncheckedCreateWithoutMapsInput> | CountryCreateWithoutMapsInput[] | CountryUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: CountryCreateOrConnectWithoutMapsInput | CountryCreateOrConnectWithoutMapsInput[]
    createMany?: CountryCreateManyMapsInputEnvelope
    connect?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
  }

  export type TownUncheckedCreateNestedManyWithoutMapsInput = {
    create?: XOR<TownCreateWithoutMapsInput, TownUncheckedCreateWithoutMapsInput> | TownCreateWithoutMapsInput[] | TownUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: TownCreateOrConnectWithoutMapsInput | TownCreateOrConnectWithoutMapsInput[]
    createMany?: TownCreateManyMapsInputEnvelope
    connect?: TownWhereUniqueInput | TownWhereUniqueInput[]
  }

  export type VillageUncheckedCreateNestedManyWithoutMapsInput = {
    create?: XOR<VillageCreateWithoutMapsInput, VillageUncheckedCreateWithoutMapsInput> | VillageCreateWithoutMapsInput[] | VillageUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: VillageCreateOrConnectWithoutMapsInput | VillageCreateOrConnectWithoutMapsInput[]
    createMany?: VillageCreateManyMapsInputEnvelope
    connect?: VillageWhereUniqueInput | VillageWhereUniqueInput[]
  }

  export type PointOfInterestUncheckedCreateNestedManyWithoutMapsInput = {
    create?: XOR<PointOfInterestCreateWithoutMapsInput, PointOfInterestUncheckedCreateWithoutMapsInput> | PointOfInterestCreateWithoutMapsInput[] | PointOfInterestUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: PointOfInterestCreateOrConnectWithoutMapsInput | PointOfInterestCreateOrConnectWithoutMapsInput[]
    createMany?: PointOfInterestCreateManyMapsInputEnvelope
    connect?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
  }

  export type PopulationUncheckedCreateNestedManyWithoutMapsInput = {
    create?: XOR<PopulationCreateWithoutMapsInput, PopulationUncheckedCreateWithoutMapsInput> | PopulationCreateWithoutMapsInput[] | PopulationUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: PopulationCreateOrConnectWithoutMapsInput | PopulationCreateOrConnectWithoutMapsInput[]
    createMany?: PopulationCreateManyMapsInputEnvelope
    connect?: PopulationWhereUniqueInput | PopulationWhereUniqueInput[]
  }

  export type CultureUncheckedCreateNestedManyWithoutMapsInput = {
    create?: XOR<CultureCreateWithoutMapsInput, CultureUncheckedCreateWithoutMapsInput> | CultureCreateWithoutMapsInput[] | CultureUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: CultureCreateOrConnectWithoutMapsInput | CultureCreateOrConnectWithoutMapsInput[]
    createMany?: CultureCreateManyMapsInputEnvelope
    connect?: CultureWhereUniqueInput | CultureWhereUniqueInput[]
  }

  export type CountryUpdateManyWithoutMapsNestedInput = {
    create?: XOR<CountryCreateWithoutMapsInput, CountryUncheckedCreateWithoutMapsInput> | CountryCreateWithoutMapsInput[] | CountryUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: CountryCreateOrConnectWithoutMapsInput | CountryCreateOrConnectWithoutMapsInput[]
    upsert?: CountryUpsertWithWhereUniqueWithoutMapsInput | CountryUpsertWithWhereUniqueWithoutMapsInput[]
    createMany?: CountryCreateManyMapsInputEnvelope
    set?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    disconnect?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    delete?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    connect?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    update?: CountryUpdateWithWhereUniqueWithoutMapsInput | CountryUpdateWithWhereUniqueWithoutMapsInput[]
    updateMany?: CountryUpdateManyWithWhereWithoutMapsInput | CountryUpdateManyWithWhereWithoutMapsInput[]
    deleteMany?: CountryScalarWhereInput | CountryScalarWhereInput[]
  }

  export type TownUpdateManyWithoutMapsNestedInput = {
    create?: XOR<TownCreateWithoutMapsInput, TownUncheckedCreateWithoutMapsInput> | TownCreateWithoutMapsInput[] | TownUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: TownCreateOrConnectWithoutMapsInput | TownCreateOrConnectWithoutMapsInput[]
    upsert?: TownUpsertWithWhereUniqueWithoutMapsInput | TownUpsertWithWhereUniqueWithoutMapsInput[]
    createMany?: TownCreateManyMapsInputEnvelope
    set?: TownWhereUniqueInput | TownWhereUniqueInput[]
    disconnect?: TownWhereUniqueInput | TownWhereUniqueInput[]
    delete?: TownWhereUniqueInput | TownWhereUniqueInput[]
    connect?: TownWhereUniqueInput | TownWhereUniqueInput[]
    update?: TownUpdateWithWhereUniqueWithoutMapsInput | TownUpdateWithWhereUniqueWithoutMapsInput[]
    updateMany?: TownUpdateManyWithWhereWithoutMapsInput | TownUpdateManyWithWhereWithoutMapsInput[]
    deleteMany?: TownScalarWhereInput | TownScalarWhereInput[]
  }

  export type VillageUpdateManyWithoutMapsNestedInput = {
    create?: XOR<VillageCreateWithoutMapsInput, VillageUncheckedCreateWithoutMapsInput> | VillageCreateWithoutMapsInput[] | VillageUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: VillageCreateOrConnectWithoutMapsInput | VillageCreateOrConnectWithoutMapsInput[]
    upsert?: VillageUpsertWithWhereUniqueWithoutMapsInput | VillageUpsertWithWhereUniqueWithoutMapsInput[]
    createMany?: VillageCreateManyMapsInputEnvelope
    set?: VillageWhereUniqueInput | VillageWhereUniqueInput[]
    disconnect?: VillageWhereUniqueInput | VillageWhereUniqueInput[]
    delete?: VillageWhereUniqueInput | VillageWhereUniqueInput[]
    connect?: VillageWhereUniqueInput | VillageWhereUniqueInput[]
    update?: VillageUpdateWithWhereUniqueWithoutMapsInput | VillageUpdateWithWhereUniqueWithoutMapsInput[]
    updateMany?: VillageUpdateManyWithWhereWithoutMapsInput | VillageUpdateManyWithWhereWithoutMapsInput[]
    deleteMany?: VillageScalarWhereInput | VillageScalarWhereInput[]
  }

  export type PointOfInterestUpdateManyWithoutMapsNestedInput = {
    create?: XOR<PointOfInterestCreateWithoutMapsInput, PointOfInterestUncheckedCreateWithoutMapsInput> | PointOfInterestCreateWithoutMapsInput[] | PointOfInterestUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: PointOfInterestCreateOrConnectWithoutMapsInput | PointOfInterestCreateOrConnectWithoutMapsInput[]
    upsert?: PointOfInterestUpsertWithWhereUniqueWithoutMapsInput | PointOfInterestUpsertWithWhereUniqueWithoutMapsInput[]
    createMany?: PointOfInterestCreateManyMapsInputEnvelope
    set?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    disconnect?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    delete?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    connect?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    update?: PointOfInterestUpdateWithWhereUniqueWithoutMapsInput | PointOfInterestUpdateWithWhereUniqueWithoutMapsInput[]
    updateMany?: PointOfInterestUpdateManyWithWhereWithoutMapsInput | PointOfInterestUpdateManyWithWhereWithoutMapsInput[]
    deleteMany?: PointOfInterestScalarWhereInput | PointOfInterestScalarWhereInput[]
  }

  export type PopulationUpdateManyWithoutMapsNestedInput = {
    create?: XOR<PopulationCreateWithoutMapsInput, PopulationUncheckedCreateWithoutMapsInput> | PopulationCreateWithoutMapsInput[] | PopulationUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: PopulationCreateOrConnectWithoutMapsInput | PopulationCreateOrConnectWithoutMapsInput[]
    upsert?: PopulationUpsertWithWhereUniqueWithoutMapsInput | PopulationUpsertWithWhereUniqueWithoutMapsInput[]
    createMany?: PopulationCreateManyMapsInputEnvelope
    set?: PopulationWhereUniqueInput | PopulationWhereUniqueInput[]
    disconnect?: PopulationWhereUniqueInput | PopulationWhereUniqueInput[]
    delete?: PopulationWhereUniqueInput | PopulationWhereUniqueInput[]
    connect?: PopulationWhereUniqueInput | PopulationWhereUniqueInput[]
    update?: PopulationUpdateWithWhereUniqueWithoutMapsInput | PopulationUpdateWithWhereUniqueWithoutMapsInput[]
    updateMany?: PopulationUpdateManyWithWhereWithoutMapsInput | PopulationUpdateManyWithWhereWithoutMapsInput[]
    deleteMany?: PopulationScalarWhereInput | PopulationScalarWhereInput[]
  }

  export type CultureUpdateManyWithoutMapsNestedInput = {
    create?: XOR<CultureCreateWithoutMapsInput, CultureUncheckedCreateWithoutMapsInput> | CultureCreateWithoutMapsInput[] | CultureUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: CultureCreateOrConnectWithoutMapsInput | CultureCreateOrConnectWithoutMapsInput[]
    upsert?: CultureUpsertWithWhereUniqueWithoutMapsInput | CultureUpsertWithWhereUniqueWithoutMapsInput[]
    createMany?: CultureCreateManyMapsInputEnvelope
    set?: CultureWhereUniqueInput | CultureWhereUniqueInput[]
    disconnect?: CultureWhereUniqueInput | CultureWhereUniqueInput[]
    delete?: CultureWhereUniqueInput | CultureWhereUniqueInput[]
    connect?: CultureWhereUniqueInput | CultureWhereUniqueInput[]
    update?: CultureUpdateWithWhereUniqueWithoutMapsInput | CultureUpdateWithWhereUniqueWithoutMapsInput[]
    updateMany?: CultureUpdateManyWithWhereWithoutMapsInput | CultureUpdateManyWithWhereWithoutMapsInput[]
    deleteMany?: CultureScalarWhereInput | CultureScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutMapsNestedInput = {
    create?: XOR<UserCreateWithoutMapsInput, UserUncheckedCreateWithoutMapsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMapsInput
    upsert?: UserUpsertWithoutMapsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMapsInput, UserUpdateWithoutMapsInput>, UserUncheckedUpdateWithoutMapsInput>
  }

  export type CountryUncheckedUpdateManyWithoutMapsNestedInput = {
    create?: XOR<CountryCreateWithoutMapsInput, CountryUncheckedCreateWithoutMapsInput> | CountryCreateWithoutMapsInput[] | CountryUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: CountryCreateOrConnectWithoutMapsInput | CountryCreateOrConnectWithoutMapsInput[]
    upsert?: CountryUpsertWithWhereUniqueWithoutMapsInput | CountryUpsertWithWhereUniqueWithoutMapsInput[]
    createMany?: CountryCreateManyMapsInputEnvelope
    set?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    disconnect?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    delete?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    connect?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    update?: CountryUpdateWithWhereUniqueWithoutMapsInput | CountryUpdateWithWhereUniqueWithoutMapsInput[]
    updateMany?: CountryUpdateManyWithWhereWithoutMapsInput | CountryUpdateManyWithWhereWithoutMapsInput[]
    deleteMany?: CountryScalarWhereInput | CountryScalarWhereInput[]
  }

  export type TownUncheckedUpdateManyWithoutMapsNestedInput = {
    create?: XOR<TownCreateWithoutMapsInput, TownUncheckedCreateWithoutMapsInput> | TownCreateWithoutMapsInput[] | TownUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: TownCreateOrConnectWithoutMapsInput | TownCreateOrConnectWithoutMapsInput[]
    upsert?: TownUpsertWithWhereUniqueWithoutMapsInput | TownUpsertWithWhereUniqueWithoutMapsInput[]
    createMany?: TownCreateManyMapsInputEnvelope
    set?: TownWhereUniqueInput | TownWhereUniqueInput[]
    disconnect?: TownWhereUniqueInput | TownWhereUniqueInput[]
    delete?: TownWhereUniqueInput | TownWhereUniqueInput[]
    connect?: TownWhereUniqueInput | TownWhereUniqueInput[]
    update?: TownUpdateWithWhereUniqueWithoutMapsInput | TownUpdateWithWhereUniqueWithoutMapsInput[]
    updateMany?: TownUpdateManyWithWhereWithoutMapsInput | TownUpdateManyWithWhereWithoutMapsInput[]
    deleteMany?: TownScalarWhereInput | TownScalarWhereInput[]
  }

  export type VillageUncheckedUpdateManyWithoutMapsNestedInput = {
    create?: XOR<VillageCreateWithoutMapsInput, VillageUncheckedCreateWithoutMapsInput> | VillageCreateWithoutMapsInput[] | VillageUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: VillageCreateOrConnectWithoutMapsInput | VillageCreateOrConnectWithoutMapsInput[]
    upsert?: VillageUpsertWithWhereUniqueWithoutMapsInput | VillageUpsertWithWhereUniqueWithoutMapsInput[]
    createMany?: VillageCreateManyMapsInputEnvelope
    set?: VillageWhereUniqueInput | VillageWhereUniqueInput[]
    disconnect?: VillageWhereUniqueInput | VillageWhereUniqueInput[]
    delete?: VillageWhereUniqueInput | VillageWhereUniqueInput[]
    connect?: VillageWhereUniqueInput | VillageWhereUniqueInput[]
    update?: VillageUpdateWithWhereUniqueWithoutMapsInput | VillageUpdateWithWhereUniqueWithoutMapsInput[]
    updateMany?: VillageUpdateManyWithWhereWithoutMapsInput | VillageUpdateManyWithWhereWithoutMapsInput[]
    deleteMany?: VillageScalarWhereInput | VillageScalarWhereInput[]
  }

  export type PointOfInterestUncheckedUpdateManyWithoutMapsNestedInput = {
    create?: XOR<PointOfInterestCreateWithoutMapsInput, PointOfInterestUncheckedCreateWithoutMapsInput> | PointOfInterestCreateWithoutMapsInput[] | PointOfInterestUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: PointOfInterestCreateOrConnectWithoutMapsInput | PointOfInterestCreateOrConnectWithoutMapsInput[]
    upsert?: PointOfInterestUpsertWithWhereUniqueWithoutMapsInput | PointOfInterestUpsertWithWhereUniqueWithoutMapsInput[]
    createMany?: PointOfInterestCreateManyMapsInputEnvelope
    set?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    disconnect?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    delete?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    connect?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    update?: PointOfInterestUpdateWithWhereUniqueWithoutMapsInput | PointOfInterestUpdateWithWhereUniqueWithoutMapsInput[]
    updateMany?: PointOfInterestUpdateManyWithWhereWithoutMapsInput | PointOfInterestUpdateManyWithWhereWithoutMapsInput[]
    deleteMany?: PointOfInterestScalarWhereInput | PointOfInterestScalarWhereInput[]
  }

  export type PopulationUncheckedUpdateManyWithoutMapsNestedInput = {
    create?: XOR<PopulationCreateWithoutMapsInput, PopulationUncheckedCreateWithoutMapsInput> | PopulationCreateWithoutMapsInput[] | PopulationUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: PopulationCreateOrConnectWithoutMapsInput | PopulationCreateOrConnectWithoutMapsInput[]
    upsert?: PopulationUpsertWithWhereUniqueWithoutMapsInput | PopulationUpsertWithWhereUniqueWithoutMapsInput[]
    createMany?: PopulationCreateManyMapsInputEnvelope
    set?: PopulationWhereUniqueInput | PopulationWhereUniqueInput[]
    disconnect?: PopulationWhereUniqueInput | PopulationWhereUniqueInput[]
    delete?: PopulationWhereUniqueInput | PopulationWhereUniqueInput[]
    connect?: PopulationWhereUniqueInput | PopulationWhereUniqueInput[]
    update?: PopulationUpdateWithWhereUniqueWithoutMapsInput | PopulationUpdateWithWhereUniqueWithoutMapsInput[]
    updateMany?: PopulationUpdateManyWithWhereWithoutMapsInput | PopulationUpdateManyWithWhereWithoutMapsInput[]
    deleteMany?: PopulationScalarWhereInput | PopulationScalarWhereInput[]
  }

  export type CultureUncheckedUpdateManyWithoutMapsNestedInput = {
    create?: XOR<CultureCreateWithoutMapsInput, CultureUncheckedCreateWithoutMapsInput> | CultureCreateWithoutMapsInput[] | CultureUncheckedCreateWithoutMapsInput[]
    connectOrCreate?: CultureCreateOrConnectWithoutMapsInput | CultureCreateOrConnectWithoutMapsInput[]
    upsert?: CultureUpsertWithWhereUniqueWithoutMapsInput | CultureUpsertWithWhereUniqueWithoutMapsInput[]
    createMany?: CultureCreateManyMapsInputEnvelope
    set?: CultureWhereUniqueInput | CultureWhereUniqueInput[]
    disconnect?: CultureWhereUniqueInput | CultureWhereUniqueInput[]
    delete?: CultureWhereUniqueInput | CultureWhereUniqueInput[]
    connect?: CultureWhereUniqueInput | CultureWhereUniqueInput[]
    update?: CultureUpdateWithWhereUniqueWithoutMapsInput | CultureUpdateWithWhereUniqueWithoutMapsInput[]
    updateMany?: CultureUpdateManyWithWhereWithoutMapsInput | CultureUpdateManyWithWhereWithoutMapsInput[]
    deleteMany?: CultureScalarWhereInput | CultureScalarWhereInput[]
  }

  export type MapCreateNestedOneWithoutCountriesInput = {
    create?: XOR<MapCreateWithoutCountriesInput, MapUncheckedCreateWithoutCountriesInput>
    connectOrCreate?: MapCreateOrConnectWithoutCountriesInput
    connect?: MapWhereUniqueInput
  }

  export type MapUpdateOneRequiredWithoutCountriesNestedInput = {
    create?: XOR<MapCreateWithoutCountriesInput, MapUncheckedCreateWithoutCountriesInput>
    connectOrCreate?: MapCreateOrConnectWithoutCountriesInput
    upsert?: MapUpsertWithoutCountriesInput
    connect?: MapWhereUniqueInput
    update?: XOR<XOR<MapUpdateToOneWithWhereWithoutCountriesInput, MapUpdateWithoutCountriesInput>, MapUncheckedUpdateWithoutCountriesInput>
  }

  export type MapCreateNestedOneWithoutTownsInput = {
    create?: XOR<MapCreateWithoutTownsInput, MapUncheckedCreateWithoutTownsInput>
    connectOrCreate?: MapCreateOrConnectWithoutTownsInput
    connect?: MapWhereUniqueInput
  }

  export type PointOfInterestCreateNestedManyWithoutTownsInput = {
    create?: XOR<PointOfInterestCreateWithoutTownsInput, PointOfInterestUncheckedCreateWithoutTownsInput> | PointOfInterestCreateWithoutTownsInput[] | PointOfInterestUncheckedCreateWithoutTownsInput[]
    connectOrCreate?: PointOfInterestCreateOrConnectWithoutTownsInput | PointOfInterestCreateOrConnectWithoutTownsInput[]
    createMany?: PointOfInterestCreateManyTownsInputEnvelope
    connect?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
  }

  export type PointOfInterestUncheckedCreateNestedManyWithoutTownsInput = {
    create?: XOR<PointOfInterestCreateWithoutTownsInput, PointOfInterestUncheckedCreateWithoutTownsInput> | PointOfInterestCreateWithoutTownsInput[] | PointOfInterestUncheckedCreateWithoutTownsInput[]
    connectOrCreate?: PointOfInterestCreateOrConnectWithoutTownsInput | PointOfInterestCreateOrConnectWithoutTownsInput[]
    createMany?: PointOfInterestCreateManyTownsInputEnvelope
    connect?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
  }

  export type MapUpdateOneRequiredWithoutTownsNestedInput = {
    create?: XOR<MapCreateWithoutTownsInput, MapUncheckedCreateWithoutTownsInput>
    connectOrCreate?: MapCreateOrConnectWithoutTownsInput
    upsert?: MapUpsertWithoutTownsInput
    connect?: MapWhereUniqueInput
    update?: XOR<XOR<MapUpdateToOneWithWhereWithoutTownsInput, MapUpdateWithoutTownsInput>, MapUncheckedUpdateWithoutTownsInput>
  }

  export type PointOfInterestUpdateManyWithoutTownsNestedInput = {
    create?: XOR<PointOfInterestCreateWithoutTownsInput, PointOfInterestUncheckedCreateWithoutTownsInput> | PointOfInterestCreateWithoutTownsInput[] | PointOfInterestUncheckedCreateWithoutTownsInput[]
    connectOrCreate?: PointOfInterestCreateOrConnectWithoutTownsInput | PointOfInterestCreateOrConnectWithoutTownsInput[]
    upsert?: PointOfInterestUpsertWithWhereUniqueWithoutTownsInput | PointOfInterestUpsertWithWhereUniqueWithoutTownsInput[]
    createMany?: PointOfInterestCreateManyTownsInputEnvelope
    set?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    disconnect?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    delete?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    connect?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    update?: PointOfInterestUpdateWithWhereUniqueWithoutTownsInput | PointOfInterestUpdateWithWhereUniqueWithoutTownsInput[]
    updateMany?: PointOfInterestUpdateManyWithWhereWithoutTownsInput | PointOfInterestUpdateManyWithWhereWithoutTownsInput[]
    deleteMany?: PointOfInterestScalarWhereInput | PointOfInterestScalarWhereInput[]
  }

  export type PointOfInterestUncheckedUpdateManyWithoutTownsNestedInput = {
    create?: XOR<PointOfInterestCreateWithoutTownsInput, PointOfInterestUncheckedCreateWithoutTownsInput> | PointOfInterestCreateWithoutTownsInput[] | PointOfInterestUncheckedCreateWithoutTownsInput[]
    connectOrCreate?: PointOfInterestCreateOrConnectWithoutTownsInput | PointOfInterestCreateOrConnectWithoutTownsInput[]
    upsert?: PointOfInterestUpsertWithWhereUniqueWithoutTownsInput | PointOfInterestUpsertWithWhereUniqueWithoutTownsInput[]
    createMany?: PointOfInterestCreateManyTownsInputEnvelope
    set?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    disconnect?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    delete?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    connect?: PointOfInterestWhereUniqueInput | PointOfInterestWhereUniqueInput[]
    update?: PointOfInterestUpdateWithWhereUniqueWithoutTownsInput | PointOfInterestUpdateWithWhereUniqueWithoutTownsInput[]
    updateMany?: PointOfInterestUpdateManyWithWhereWithoutTownsInput | PointOfInterestUpdateManyWithWhereWithoutTownsInput[]
    deleteMany?: PointOfInterestScalarWhereInput | PointOfInterestScalarWhereInput[]
  }

  export type MapCreateNestedOneWithoutVillagesInput = {
    create?: XOR<MapCreateWithoutVillagesInput, MapUncheckedCreateWithoutVillagesInput>
    connectOrCreate?: MapCreateOrConnectWithoutVillagesInput
    connect?: MapWhereUniqueInput
  }

  export type MapUpdateOneRequiredWithoutVillagesNestedInput = {
    create?: XOR<MapCreateWithoutVillagesInput, MapUncheckedCreateWithoutVillagesInput>
    connectOrCreate?: MapCreateOrConnectWithoutVillagesInput
    upsert?: MapUpsertWithoutVillagesInput
    connect?: MapWhereUniqueInput
    update?: XOR<XOR<MapUpdateToOneWithWhereWithoutVillagesInput, MapUpdateWithoutVillagesInput>, MapUncheckedUpdateWithoutVillagesInput>
  }

  export type MapCreateNestedOneWithoutPoiInput = {
    create?: XOR<MapCreateWithoutPoiInput, MapUncheckedCreateWithoutPoiInput>
    connectOrCreate?: MapCreateOrConnectWithoutPoiInput
    connect?: MapWhereUniqueInput
  }

  export type TownCreateNestedOneWithoutPoiInput = {
    create?: XOR<TownCreateWithoutPoiInput, TownUncheckedCreateWithoutPoiInput>
    connectOrCreate?: TownCreateOrConnectWithoutPoiInput
    connect?: TownWhereUniqueInput
  }

  export type MapUpdateOneRequiredWithoutPoiNestedInput = {
    create?: XOR<MapCreateWithoutPoiInput, MapUncheckedCreateWithoutPoiInput>
    connectOrCreate?: MapCreateOrConnectWithoutPoiInput
    upsert?: MapUpsertWithoutPoiInput
    connect?: MapWhereUniqueInput
    update?: XOR<XOR<MapUpdateToOneWithWhereWithoutPoiInput, MapUpdateWithoutPoiInput>, MapUncheckedUpdateWithoutPoiInput>
  }

  export type TownUpdateOneRequiredWithoutPoiNestedInput = {
    create?: XOR<TownCreateWithoutPoiInput, TownUncheckedCreateWithoutPoiInput>
    connectOrCreate?: TownCreateOrConnectWithoutPoiInput
    upsert?: TownUpsertWithoutPoiInput
    connect?: TownWhereUniqueInput
    update?: XOR<XOR<TownUpdateToOneWithWhereWithoutPoiInput, TownUpdateWithoutPoiInput>, TownUncheckedUpdateWithoutPoiInput>
  }

  export type MapCreateNestedOneWithoutPopulationInput = {
    create?: XOR<MapCreateWithoutPopulationInput, MapUncheckedCreateWithoutPopulationInput>
    connectOrCreate?: MapCreateOrConnectWithoutPopulationInput
    connect?: MapWhereUniqueInput
  }

  export type MapUpdateOneRequiredWithoutPopulationNestedInput = {
    create?: XOR<MapCreateWithoutPopulationInput, MapUncheckedCreateWithoutPopulationInput>
    connectOrCreate?: MapCreateOrConnectWithoutPopulationInput
    upsert?: MapUpsertWithoutPopulationInput
    connect?: MapWhereUniqueInput
    update?: XOR<XOR<MapUpdateToOneWithWhereWithoutPopulationInput, MapUpdateWithoutPopulationInput>, MapUncheckedUpdateWithoutPopulationInput>
  }

  export type MapCreateNestedOneWithoutCultureInput = {
    create?: XOR<MapCreateWithoutCultureInput, MapUncheckedCreateWithoutCultureInput>
    connectOrCreate?: MapCreateOrConnectWithoutCultureInput
    connect?: MapWhereUniqueInput
  }

  export type MapUpdateOneRequiredWithoutCultureNestedInput = {
    create?: XOR<MapCreateWithoutCultureInput, MapUncheckedCreateWithoutCultureInput>
    connectOrCreate?: MapCreateOrConnectWithoutCultureInput
    upsert?: MapUpsertWithoutCultureInput
    connect?: MapWhereUniqueInput
    update?: XOR<XOR<MapUpdateToOneWithWhereWithoutCultureInput, MapUpdateWithoutCultureInput>, MapUncheckedUpdateWithoutCultureInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type SessionCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountCreateWithoutUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MapCreateWithoutUserInput = {
    id: string
    name: string
    url: string
    description?: string | null
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryCreateNestedManyWithoutMapsInput
    towns?: TownCreateNestedManyWithoutMapsInput
    villages?: VillageCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestCreateNestedManyWithoutMapsInput
    population?: PopulationCreateNestedManyWithoutMapsInput
    culture?: CultureCreateNestedManyWithoutMapsInput
  }

  export type MapUncheckedCreateWithoutUserInput = {
    id: string
    name: string
    url: string
    description?: string | null
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryUncheckedCreateNestedManyWithoutMapsInput
    towns?: TownUncheckedCreateNestedManyWithoutMapsInput
    villages?: VillageUncheckedCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestUncheckedCreateNestedManyWithoutMapsInput
    population?: PopulationUncheckedCreateNestedManyWithoutMapsInput
    culture?: CultureUncheckedCreateNestedManyWithoutMapsInput
  }

  export type MapCreateOrConnectWithoutUserInput = {
    where: MapWhereUniqueInput
    create: XOR<MapCreateWithoutUserInput, MapUncheckedCreateWithoutUserInput>
  }

  export type MapCreateManyUserInputEnvelope = {
    data: MapCreateManyUserInput | MapCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    impersonatedBy?: StringNullableFilter<"Session"> | string | null
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type MapUpsertWithWhereUniqueWithoutUserInput = {
    where: MapWhereUniqueInput
    update: XOR<MapUpdateWithoutUserInput, MapUncheckedUpdateWithoutUserInput>
    create: XOR<MapCreateWithoutUserInput, MapUncheckedCreateWithoutUserInput>
  }

  export type MapUpdateWithWhereUniqueWithoutUserInput = {
    where: MapWhereUniqueInput
    data: XOR<MapUpdateWithoutUserInput, MapUncheckedUpdateWithoutUserInput>
  }

  export type MapUpdateManyWithWhereWithoutUserInput = {
    where: MapScalarWhereInput
    data: XOR<MapUpdateManyMutationInput, MapUncheckedUpdateManyWithoutUserInput>
  }

  export type MapScalarWhereInput = {
    AND?: MapScalarWhereInput | MapScalarWhereInput[]
    OR?: MapScalarWhereInput[]
    NOT?: MapScalarWhereInput | MapScalarWhereInput[]
    id?: StringFilter<"Map"> | string
    name?: StringFilter<"Map"> | string
    url?: StringFilter<"Map"> | string
    description?: StringNullableFilter<"Map"> | string | null
    owner?: StringFilter<"Map"> | string
    createdAt?: DateTimeNullableFilter<"Map"> | Date | string | null
    updateAt?: DateTimeNullableFilter<"Map"> | Date | string | null
  }

  export type UserCreateWithoutSessionsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    username?: string | null
    displayUsername?: string | null
    isAnonymous?: boolean | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    accounts?: AccountCreateNestedManyWithoutUserInput
    maps?: MapCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    username?: string | null
    displayUsername?: string | null
    isAnonymous?: boolean | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    maps?: MapUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayUsername?: NullableStringFieldUpdateOperationsInput | string | null
    isAnonymous?: NullableBoolFieldUpdateOperationsInput | boolean | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accounts?: AccountUpdateManyWithoutUserNestedInput
    maps?: MapUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayUsername?: NullableStringFieldUpdateOperationsInput | string | null
    isAnonymous?: NullableBoolFieldUpdateOperationsInput | boolean | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    maps?: MapUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAccountsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    username?: string | null
    displayUsername?: string | null
    isAnonymous?: boolean | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    maps?: MapCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    username?: string | null
    displayUsername?: string | null
    isAnonymous?: boolean | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    maps?: MapUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayUsername?: NullableStringFieldUpdateOperationsInput | string | null
    isAnonymous?: NullableBoolFieldUpdateOperationsInput | boolean | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    maps?: MapUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayUsername?: NullableStringFieldUpdateOperationsInput | string | null
    isAnonymous?: NullableBoolFieldUpdateOperationsInput | boolean | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    maps?: MapUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CountryCreateWithoutMapsInput = {
    id: string
    name: string
    area: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type CountryUncheckedCreateWithoutMapsInput = {
    id: string
    name: string
    area: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type CountryCreateOrConnectWithoutMapsInput = {
    where: CountryWhereUniqueInput
    create: XOR<CountryCreateWithoutMapsInput, CountryUncheckedCreateWithoutMapsInput>
  }

  export type CountryCreateManyMapsInputEnvelope = {
    data: CountryCreateManyMapsInput | CountryCreateManyMapsInput[]
    skipDuplicates?: boolean
  }

  export type TownCreateWithoutMapsInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    poi?: PointOfInterestCreateNestedManyWithoutTownsInput
  }

  export type TownUncheckedCreateWithoutMapsInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    poi?: PointOfInterestUncheckedCreateNestedManyWithoutTownsInput
  }

  export type TownCreateOrConnectWithoutMapsInput = {
    where: TownWhereUniqueInput
    create: XOR<TownCreateWithoutMapsInput, TownUncheckedCreateWithoutMapsInput>
  }

  export type TownCreateManyMapsInputEnvelope = {
    data: TownCreateManyMapsInput | TownCreateManyMapsInput[]
    skipDuplicates?: boolean
  }

  export type VillageCreateWithoutMapsInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VillageUncheckedCreateWithoutMapsInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VillageCreateOrConnectWithoutMapsInput = {
    where: VillageWhereUniqueInput
    create: XOR<VillageCreateWithoutMapsInput, VillageUncheckedCreateWithoutMapsInput>
  }

  export type VillageCreateManyMapsInputEnvelope = {
    data: VillageCreateManyMapsInput | VillageCreateManyMapsInput[]
    skipDuplicates?: boolean
  }

  export type PointOfInterestCreateWithoutMapsInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    towns: TownCreateNestedOneWithoutPoiInput
  }

  export type PointOfInterestUncheckedCreateWithoutMapsInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    town: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type PointOfInterestCreateOrConnectWithoutMapsInput = {
    where: PointOfInterestWhereUniqueInput
    create: XOR<PointOfInterestCreateWithoutMapsInput, PointOfInterestUncheckedCreateWithoutMapsInput>
  }

  export type PointOfInterestCreateManyMapsInputEnvelope = {
    data: PointOfInterestCreateManyMapsInput | PointOfInterestCreateManyMapsInput[]
    skipDuplicates?: boolean
  }

  export type PopulationCreateWithoutMapsInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type PopulationUncheckedCreateWithoutMapsInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type PopulationCreateOrConnectWithoutMapsInput = {
    where: PopulationWhereUniqueInput
    create: XOR<PopulationCreateWithoutMapsInput, PopulationUncheckedCreateWithoutMapsInput>
  }

  export type PopulationCreateManyMapsInputEnvelope = {
    data: PopulationCreateManyMapsInput | PopulationCreateManyMapsInput[]
    skipDuplicates?: boolean
  }

  export type CultureCreateWithoutMapsInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type CultureUncheckedCreateWithoutMapsInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type CultureCreateOrConnectWithoutMapsInput = {
    where: CultureWhereUniqueInput
    create: XOR<CultureCreateWithoutMapsInput, CultureUncheckedCreateWithoutMapsInput>
  }

  export type CultureCreateManyMapsInputEnvelope = {
    data: CultureCreateManyMapsInput | CultureCreateManyMapsInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutMapsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    username?: string | null
    displayUsername?: string | null
    isAnonymous?: boolean | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMapsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    username?: string | null
    displayUsername?: string | null
    isAnonymous?: boolean | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMapsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMapsInput, UserUncheckedCreateWithoutMapsInput>
  }

  export type CountryUpsertWithWhereUniqueWithoutMapsInput = {
    where: CountryWhereUniqueInput
    update: XOR<CountryUpdateWithoutMapsInput, CountryUncheckedUpdateWithoutMapsInput>
    create: XOR<CountryCreateWithoutMapsInput, CountryUncheckedCreateWithoutMapsInput>
  }

  export type CountryUpdateWithWhereUniqueWithoutMapsInput = {
    where: CountryWhereUniqueInput
    data: XOR<CountryUpdateWithoutMapsInput, CountryUncheckedUpdateWithoutMapsInput>
  }

  export type CountryUpdateManyWithWhereWithoutMapsInput = {
    where: CountryScalarWhereInput
    data: XOR<CountryUpdateManyMutationInput, CountryUncheckedUpdateManyWithoutMapsInput>
  }

  export type CountryScalarWhereInput = {
    AND?: CountryScalarWhereInput | CountryScalarWhereInput[]
    OR?: CountryScalarWhereInput[]
    NOT?: CountryScalarWhereInput | CountryScalarWhereInput[]
    id?: StringFilter<"Country"> | string
    name?: StringFilter<"Country"> | string
    area?: StringFilter<"Country"> | string
    description?: StringNullableFilter<"Country"> | string | null
    map?: StringFilter<"Country"> | string
    createdAt?: DateTimeNullableFilter<"Country"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Country"> | Date | string | null
  }

  export type TownUpsertWithWhereUniqueWithoutMapsInput = {
    where: TownWhereUniqueInput
    update: XOR<TownUpdateWithoutMapsInput, TownUncheckedUpdateWithoutMapsInput>
    create: XOR<TownCreateWithoutMapsInput, TownUncheckedCreateWithoutMapsInput>
  }

  export type TownUpdateWithWhereUniqueWithoutMapsInput = {
    where: TownWhereUniqueInput
    data: XOR<TownUpdateWithoutMapsInput, TownUncheckedUpdateWithoutMapsInput>
  }

  export type TownUpdateManyWithWhereWithoutMapsInput = {
    where: TownScalarWhereInput
    data: XOR<TownUpdateManyMutationInput, TownUncheckedUpdateManyWithoutMapsInput>
  }

  export type TownScalarWhereInput = {
    AND?: TownScalarWhereInput | TownScalarWhereInput[]
    OR?: TownScalarWhereInput[]
    NOT?: TownScalarWhereInput | TownScalarWhereInput[]
    id?: StringFilter<"Town"> | string
    name?: StringFilter<"Town"> | string
    icon?: StringFilter<"Town"> | string
    description?: StringNullableFilter<"Town"> | string | null
    map?: StringFilter<"Town"> | string
    createdAt?: DateTimeNullableFilter<"Town"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Town"> | Date | string | null
  }

  export type VillageUpsertWithWhereUniqueWithoutMapsInput = {
    where: VillageWhereUniqueInput
    update: XOR<VillageUpdateWithoutMapsInput, VillageUncheckedUpdateWithoutMapsInput>
    create: XOR<VillageCreateWithoutMapsInput, VillageUncheckedCreateWithoutMapsInput>
  }

  export type VillageUpdateWithWhereUniqueWithoutMapsInput = {
    where: VillageWhereUniqueInput
    data: XOR<VillageUpdateWithoutMapsInput, VillageUncheckedUpdateWithoutMapsInput>
  }

  export type VillageUpdateManyWithWhereWithoutMapsInput = {
    where: VillageScalarWhereInput
    data: XOR<VillageUpdateManyMutationInput, VillageUncheckedUpdateManyWithoutMapsInput>
  }

  export type VillageScalarWhereInput = {
    AND?: VillageScalarWhereInput | VillageScalarWhereInput[]
    OR?: VillageScalarWhereInput[]
    NOT?: VillageScalarWhereInput | VillageScalarWhereInput[]
    id?: StringFilter<"Village"> | string
    name?: StringFilter<"Village"> | string
    icon?: StringFilter<"Village"> | string
    description?: StringNullableFilter<"Village"> | string | null
    map?: StringFilter<"Village"> | string
    createdAt?: DateTimeNullableFilter<"Village"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Village"> | Date | string | null
  }

  export type PointOfInterestUpsertWithWhereUniqueWithoutMapsInput = {
    where: PointOfInterestWhereUniqueInput
    update: XOR<PointOfInterestUpdateWithoutMapsInput, PointOfInterestUncheckedUpdateWithoutMapsInput>
    create: XOR<PointOfInterestCreateWithoutMapsInput, PointOfInterestUncheckedCreateWithoutMapsInput>
  }

  export type PointOfInterestUpdateWithWhereUniqueWithoutMapsInput = {
    where: PointOfInterestWhereUniqueInput
    data: XOR<PointOfInterestUpdateWithoutMapsInput, PointOfInterestUncheckedUpdateWithoutMapsInput>
  }

  export type PointOfInterestUpdateManyWithWhereWithoutMapsInput = {
    where: PointOfInterestScalarWhereInput
    data: XOR<PointOfInterestUpdateManyMutationInput, PointOfInterestUncheckedUpdateManyWithoutMapsInput>
  }

  export type PointOfInterestScalarWhereInput = {
    AND?: PointOfInterestScalarWhereInput | PointOfInterestScalarWhereInput[]
    OR?: PointOfInterestScalarWhereInput[]
    NOT?: PointOfInterestScalarWhereInput | PointOfInterestScalarWhereInput[]
    id?: StringFilter<"PointOfInterest"> | string
    name?: StringFilter<"PointOfInterest"> | string
    icon?: StringFilter<"PointOfInterest"> | string
    description?: StringNullableFilter<"PointOfInterest"> | string | null
    map?: StringFilter<"PointOfInterest"> | string
    town?: StringFilter<"PointOfInterest"> | string
    createdAt?: DateTimeNullableFilter<"PointOfInterest"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"PointOfInterest"> | Date | string | null
  }

  export type PopulationUpsertWithWhereUniqueWithoutMapsInput = {
    where: PopulationWhereUniqueInput
    update: XOR<PopulationUpdateWithoutMapsInput, PopulationUncheckedUpdateWithoutMapsInput>
    create: XOR<PopulationCreateWithoutMapsInput, PopulationUncheckedCreateWithoutMapsInput>
  }

  export type PopulationUpdateWithWhereUniqueWithoutMapsInput = {
    where: PopulationWhereUniqueInput
    data: XOR<PopulationUpdateWithoutMapsInput, PopulationUncheckedUpdateWithoutMapsInput>
  }

  export type PopulationUpdateManyWithWhereWithoutMapsInput = {
    where: PopulationScalarWhereInput
    data: XOR<PopulationUpdateManyMutationInput, PopulationUncheckedUpdateManyWithoutMapsInput>
  }

  export type PopulationScalarWhereInput = {
    AND?: PopulationScalarWhereInput | PopulationScalarWhereInput[]
    OR?: PopulationScalarWhereInput[]
    NOT?: PopulationScalarWhereInput | PopulationScalarWhereInput[]
    id?: StringFilter<"Population"> | string
    name?: StringFilter<"Population"> | string
    description?: StringNullableFilter<"Population"> | string | null
    map?: StringFilter<"Population"> | string
    createdAt?: DateTimeNullableFilter<"Population"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Population"> | Date | string | null
  }

  export type CultureUpsertWithWhereUniqueWithoutMapsInput = {
    where: CultureWhereUniqueInput
    update: XOR<CultureUpdateWithoutMapsInput, CultureUncheckedUpdateWithoutMapsInput>
    create: XOR<CultureCreateWithoutMapsInput, CultureUncheckedCreateWithoutMapsInput>
  }

  export type CultureUpdateWithWhereUniqueWithoutMapsInput = {
    where: CultureWhereUniqueInput
    data: XOR<CultureUpdateWithoutMapsInput, CultureUncheckedUpdateWithoutMapsInput>
  }

  export type CultureUpdateManyWithWhereWithoutMapsInput = {
    where: CultureScalarWhereInput
    data: XOR<CultureUpdateManyMutationInput, CultureUncheckedUpdateManyWithoutMapsInput>
  }

  export type CultureScalarWhereInput = {
    AND?: CultureScalarWhereInput | CultureScalarWhereInput[]
    OR?: CultureScalarWhereInput[]
    NOT?: CultureScalarWhereInput | CultureScalarWhereInput[]
    id?: StringFilter<"Culture"> | string
    name?: StringFilter<"Culture"> | string
    description?: StringNullableFilter<"Culture"> | string | null
    map?: StringFilter<"Culture"> | string
    createdAt?: DateTimeNullableFilter<"Culture"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Culture"> | Date | string | null
  }

  export type UserUpsertWithoutMapsInput = {
    update: XOR<UserUpdateWithoutMapsInput, UserUncheckedUpdateWithoutMapsInput>
    create: XOR<UserCreateWithoutMapsInput, UserUncheckedCreateWithoutMapsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMapsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMapsInput, UserUncheckedUpdateWithoutMapsInput>
  }

  export type UserUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayUsername?: NullableStringFieldUpdateOperationsInput | string | null
    isAnonymous?: NullableBoolFieldUpdateOperationsInput | boolean | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayUsername?: NullableStringFieldUpdateOperationsInput | string | null
    isAnonymous?: NullableBoolFieldUpdateOperationsInput | boolean | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MapCreateWithoutCountriesInput = {
    id: string
    name: string
    url: string
    description?: string | null
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    towns?: TownCreateNestedManyWithoutMapsInput
    villages?: VillageCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestCreateNestedManyWithoutMapsInput
    population?: PopulationCreateNestedManyWithoutMapsInput
    culture?: CultureCreateNestedManyWithoutMapsInput
    user: UserCreateNestedOneWithoutMapsInput
  }

  export type MapUncheckedCreateWithoutCountriesInput = {
    id: string
    name: string
    url: string
    description?: string | null
    owner: string
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    towns?: TownUncheckedCreateNestedManyWithoutMapsInput
    villages?: VillageUncheckedCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestUncheckedCreateNestedManyWithoutMapsInput
    population?: PopulationUncheckedCreateNestedManyWithoutMapsInput
    culture?: CultureUncheckedCreateNestedManyWithoutMapsInput
  }

  export type MapCreateOrConnectWithoutCountriesInput = {
    where: MapWhereUniqueInput
    create: XOR<MapCreateWithoutCountriesInput, MapUncheckedCreateWithoutCountriesInput>
  }

  export type MapUpsertWithoutCountriesInput = {
    update: XOR<MapUpdateWithoutCountriesInput, MapUncheckedUpdateWithoutCountriesInput>
    create: XOR<MapCreateWithoutCountriesInput, MapUncheckedCreateWithoutCountriesInput>
    where?: MapWhereInput
  }

  export type MapUpdateToOneWithWhereWithoutCountriesInput = {
    where?: MapWhereInput
    data: XOR<MapUpdateWithoutCountriesInput, MapUncheckedUpdateWithoutCountriesInput>
  }

  export type MapUpdateWithoutCountriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    towns?: TownUpdateManyWithoutMapsNestedInput
    villages?: VillageUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUpdateManyWithoutMapsNestedInput
    population?: PopulationUpdateManyWithoutMapsNestedInput
    culture?: CultureUpdateManyWithoutMapsNestedInput
    user?: UserUpdateOneRequiredWithoutMapsNestedInput
  }

  export type MapUncheckedUpdateWithoutCountriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    towns?: TownUncheckedUpdateManyWithoutMapsNestedInput
    villages?: VillageUncheckedUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUncheckedUpdateManyWithoutMapsNestedInput
    population?: PopulationUncheckedUpdateManyWithoutMapsNestedInput
    culture?: CultureUncheckedUpdateManyWithoutMapsNestedInput
  }

  export type MapCreateWithoutTownsInput = {
    id: string
    name: string
    url: string
    description?: string | null
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryCreateNestedManyWithoutMapsInput
    villages?: VillageCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestCreateNestedManyWithoutMapsInput
    population?: PopulationCreateNestedManyWithoutMapsInput
    culture?: CultureCreateNestedManyWithoutMapsInput
    user: UserCreateNestedOneWithoutMapsInput
  }

  export type MapUncheckedCreateWithoutTownsInput = {
    id: string
    name: string
    url: string
    description?: string | null
    owner: string
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryUncheckedCreateNestedManyWithoutMapsInput
    villages?: VillageUncheckedCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestUncheckedCreateNestedManyWithoutMapsInput
    population?: PopulationUncheckedCreateNestedManyWithoutMapsInput
    culture?: CultureUncheckedCreateNestedManyWithoutMapsInput
  }

  export type MapCreateOrConnectWithoutTownsInput = {
    where: MapWhereUniqueInput
    create: XOR<MapCreateWithoutTownsInput, MapUncheckedCreateWithoutTownsInput>
  }

  export type PointOfInterestCreateWithoutTownsInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    maps: MapCreateNestedOneWithoutPoiInput
  }

  export type PointOfInterestUncheckedCreateWithoutTownsInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type PointOfInterestCreateOrConnectWithoutTownsInput = {
    where: PointOfInterestWhereUniqueInput
    create: XOR<PointOfInterestCreateWithoutTownsInput, PointOfInterestUncheckedCreateWithoutTownsInput>
  }

  export type PointOfInterestCreateManyTownsInputEnvelope = {
    data: PointOfInterestCreateManyTownsInput | PointOfInterestCreateManyTownsInput[]
    skipDuplicates?: boolean
  }

  export type MapUpsertWithoutTownsInput = {
    update: XOR<MapUpdateWithoutTownsInput, MapUncheckedUpdateWithoutTownsInput>
    create: XOR<MapCreateWithoutTownsInput, MapUncheckedCreateWithoutTownsInput>
    where?: MapWhereInput
  }

  export type MapUpdateToOneWithWhereWithoutTownsInput = {
    where?: MapWhereInput
    data: XOR<MapUpdateWithoutTownsInput, MapUncheckedUpdateWithoutTownsInput>
  }

  export type MapUpdateWithoutTownsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUpdateManyWithoutMapsNestedInput
    villages?: VillageUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUpdateManyWithoutMapsNestedInput
    population?: PopulationUpdateManyWithoutMapsNestedInput
    culture?: CultureUpdateManyWithoutMapsNestedInput
    user?: UserUpdateOneRequiredWithoutMapsNestedInput
  }

  export type MapUncheckedUpdateWithoutTownsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUncheckedUpdateManyWithoutMapsNestedInput
    villages?: VillageUncheckedUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUncheckedUpdateManyWithoutMapsNestedInput
    population?: PopulationUncheckedUpdateManyWithoutMapsNestedInput
    culture?: CultureUncheckedUpdateManyWithoutMapsNestedInput
  }

  export type PointOfInterestUpsertWithWhereUniqueWithoutTownsInput = {
    where: PointOfInterestWhereUniqueInput
    update: XOR<PointOfInterestUpdateWithoutTownsInput, PointOfInterestUncheckedUpdateWithoutTownsInput>
    create: XOR<PointOfInterestCreateWithoutTownsInput, PointOfInterestUncheckedCreateWithoutTownsInput>
  }

  export type PointOfInterestUpdateWithWhereUniqueWithoutTownsInput = {
    where: PointOfInterestWhereUniqueInput
    data: XOR<PointOfInterestUpdateWithoutTownsInput, PointOfInterestUncheckedUpdateWithoutTownsInput>
  }

  export type PointOfInterestUpdateManyWithWhereWithoutTownsInput = {
    where: PointOfInterestScalarWhereInput
    data: XOR<PointOfInterestUpdateManyMutationInput, PointOfInterestUncheckedUpdateManyWithoutTownsInput>
  }

  export type MapCreateWithoutVillagesInput = {
    id: string
    name: string
    url: string
    description?: string | null
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryCreateNestedManyWithoutMapsInput
    towns?: TownCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestCreateNestedManyWithoutMapsInput
    population?: PopulationCreateNestedManyWithoutMapsInput
    culture?: CultureCreateNestedManyWithoutMapsInput
    user: UserCreateNestedOneWithoutMapsInput
  }

  export type MapUncheckedCreateWithoutVillagesInput = {
    id: string
    name: string
    url: string
    description?: string | null
    owner: string
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryUncheckedCreateNestedManyWithoutMapsInput
    towns?: TownUncheckedCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestUncheckedCreateNestedManyWithoutMapsInput
    population?: PopulationUncheckedCreateNestedManyWithoutMapsInput
    culture?: CultureUncheckedCreateNestedManyWithoutMapsInput
  }

  export type MapCreateOrConnectWithoutVillagesInput = {
    where: MapWhereUniqueInput
    create: XOR<MapCreateWithoutVillagesInput, MapUncheckedCreateWithoutVillagesInput>
  }

  export type MapUpsertWithoutVillagesInput = {
    update: XOR<MapUpdateWithoutVillagesInput, MapUncheckedUpdateWithoutVillagesInput>
    create: XOR<MapCreateWithoutVillagesInput, MapUncheckedCreateWithoutVillagesInput>
    where?: MapWhereInput
  }

  export type MapUpdateToOneWithWhereWithoutVillagesInput = {
    where?: MapWhereInput
    data: XOR<MapUpdateWithoutVillagesInput, MapUncheckedUpdateWithoutVillagesInput>
  }

  export type MapUpdateWithoutVillagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUpdateManyWithoutMapsNestedInput
    towns?: TownUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUpdateManyWithoutMapsNestedInput
    population?: PopulationUpdateManyWithoutMapsNestedInput
    culture?: CultureUpdateManyWithoutMapsNestedInput
    user?: UserUpdateOneRequiredWithoutMapsNestedInput
  }

  export type MapUncheckedUpdateWithoutVillagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUncheckedUpdateManyWithoutMapsNestedInput
    towns?: TownUncheckedUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUncheckedUpdateManyWithoutMapsNestedInput
    population?: PopulationUncheckedUpdateManyWithoutMapsNestedInput
    culture?: CultureUncheckedUpdateManyWithoutMapsNestedInput
  }

  export type MapCreateWithoutPoiInput = {
    id: string
    name: string
    url: string
    description?: string | null
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryCreateNestedManyWithoutMapsInput
    towns?: TownCreateNestedManyWithoutMapsInput
    villages?: VillageCreateNestedManyWithoutMapsInput
    population?: PopulationCreateNestedManyWithoutMapsInput
    culture?: CultureCreateNestedManyWithoutMapsInput
    user: UserCreateNestedOneWithoutMapsInput
  }

  export type MapUncheckedCreateWithoutPoiInput = {
    id: string
    name: string
    url: string
    description?: string | null
    owner: string
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryUncheckedCreateNestedManyWithoutMapsInput
    towns?: TownUncheckedCreateNestedManyWithoutMapsInput
    villages?: VillageUncheckedCreateNestedManyWithoutMapsInput
    population?: PopulationUncheckedCreateNestedManyWithoutMapsInput
    culture?: CultureUncheckedCreateNestedManyWithoutMapsInput
  }

  export type MapCreateOrConnectWithoutPoiInput = {
    where: MapWhereUniqueInput
    create: XOR<MapCreateWithoutPoiInput, MapUncheckedCreateWithoutPoiInput>
  }

  export type TownCreateWithoutPoiInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    maps: MapCreateNestedOneWithoutTownsInput
  }

  export type TownUncheckedCreateWithoutPoiInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type TownCreateOrConnectWithoutPoiInput = {
    where: TownWhereUniqueInput
    create: XOR<TownCreateWithoutPoiInput, TownUncheckedCreateWithoutPoiInput>
  }

  export type MapUpsertWithoutPoiInput = {
    update: XOR<MapUpdateWithoutPoiInput, MapUncheckedUpdateWithoutPoiInput>
    create: XOR<MapCreateWithoutPoiInput, MapUncheckedCreateWithoutPoiInput>
    where?: MapWhereInput
  }

  export type MapUpdateToOneWithWhereWithoutPoiInput = {
    where?: MapWhereInput
    data: XOR<MapUpdateWithoutPoiInput, MapUncheckedUpdateWithoutPoiInput>
  }

  export type MapUpdateWithoutPoiInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUpdateManyWithoutMapsNestedInput
    towns?: TownUpdateManyWithoutMapsNestedInput
    villages?: VillageUpdateManyWithoutMapsNestedInput
    population?: PopulationUpdateManyWithoutMapsNestedInput
    culture?: CultureUpdateManyWithoutMapsNestedInput
    user?: UserUpdateOneRequiredWithoutMapsNestedInput
  }

  export type MapUncheckedUpdateWithoutPoiInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUncheckedUpdateManyWithoutMapsNestedInput
    towns?: TownUncheckedUpdateManyWithoutMapsNestedInput
    villages?: VillageUncheckedUpdateManyWithoutMapsNestedInput
    population?: PopulationUncheckedUpdateManyWithoutMapsNestedInput
    culture?: CultureUncheckedUpdateManyWithoutMapsNestedInput
  }

  export type TownUpsertWithoutPoiInput = {
    update: XOR<TownUpdateWithoutPoiInput, TownUncheckedUpdateWithoutPoiInput>
    create: XOR<TownCreateWithoutPoiInput, TownUncheckedCreateWithoutPoiInput>
    where?: TownWhereInput
  }

  export type TownUpdateToOneWithWhereWithoutPoiInput = {
    where?: TownWhereInput
    data: XOR<TownUpdateWithoutPoiInput, TownUncheckedUpdateWithoutPoiInput>
  }

  export type TownUpdateWithoutPoiInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maps?: MapUpdateOneRequiredWithoutTownsNestedInput
  }

  export type TownUncheckedUpdateWithoutPoiInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MapCreateWithoutPopulationInput = {
    id: string
    name: string
    url: string
    description?: string | null
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryCreateNestedManyWithoutMapsInput
    towns?: TownCreateNestedManyWithoutMapsInput
    villages?: VillageCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestCreateNestedManyWithoutMapsInput
    culture?: CultureCreateNestedManyWithoutMapsInput
    user: UserCreateNestedOneWithoutMapsInput
  }

  export type MapUncheckedCreateWithoutPopulationInput = {
    id: string
    name: string
    url: string
    description?: string | null
    owner: string
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryUncheckedCreateNestedManyWithoutMapsInput
    towns?: TownUncheckedCreateNestedManyWithoutMapsInput
    villages?: VillageUncheckedCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestUncheckedCreateNestedManyWithoutMapsInput
    culture?: CultureUncheckedCreateNestedManyWithoutMapsInput
  }

  export type MapCreateOrConnectWithoutPopulationInput = {
    where: MapWhereUniqueInput
    create: XOR<MapCreateWithoutPopulationInput, MapUncheckedCreateWithoutPopulationInput>
  }

  export type MapUpsertWithoutPopulationInput = {
    update: XOR<MapUpdateWithoutPopulationInput, MapUncheckedUpdateWithoutPopulationInput>
    create: XOR<MapCreateWithoutPopulationInput, MapUncheckedCreateWithoutPopulationInput>
    where?: MapWhereInput
  }

  export type MapUpdateToOneWithWhereWithoutPopulationInput = {
    where?: MapWhereInput
    data: XOR<MapUpdateWithoutPopulationInput, MapUncheckedUpdateWithoutPopulationInput>
  }

  export type MapUpdateWithoutPopulationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUpdateManyWithoutMapsNestedInput
    towns?: TownUpdateManyWithoutMapsNestedInput
    villages?: VillageUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUpdateManyWithoutMapsNestedInput
    culture?: CultureUpdateManyWithoutMapsNestedInput
    user?: UserUpdateOneRequiredWithoutMapsNestedInput
  }

  export type MapUncheckedUpdateWithoutPopulationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUncheckedUpdateManyWithoutMapsNestedInput
    towns?: TownUncheckedUpdateManyWithoutMapsNestedInput
    villages?: VillageUncheckedUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUncheckedUpdateManyWithoutMapsNestedInput
    culture?: CultureUncheckedUpdateManyWithoutMapsNestedInput
  }

  export type MapCreateWithoutCultureInput = {
    id: string
    name: string
    url: string
    description?: string | null
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryCreateNestedManyWithoutMapsInput
    towns?: TownCreateNestedManyWithoutMapsInput
    villages?: VillageCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestCreateNestedManyWithoutMapsInput
    population?: PopulationCreateNestedManyWithoutMapsInput
    user: UserCreateNestedOneWithoutMapsInput
  }

  export type MapUncheckedCreateWithoutCultureInput = {
    id: string
    name: string
    url: string
    description?: string | null
    owner: string
    createdAt?: Date | string | null
    updateAt?: Date | string | null
    countries?: CountryUncheckedCreateNestedManyWithoutMapsInput
    towns?: TownUncheckedCreateNestedManyWithoutMapsInput
    villages?: VillageUncheckedCreateNestedManyWithoutMapsInput
    poi?: PointOfInterestUncheckedCreateNestedManyWithoutMapsInput
    population?: PopulationUncheckedCreateNestedManyWithoutMapsInput
  }

  export type MapCreateOrConnectWithoutCultureInput = {
    where: MapWhereUniqueInput
    create: XOR<MapCreateWithoutCultureInput, MapUncheckedCreateWithoutCultureInput>
  }

  export type MapUpsertWithoutCultureInput = {
    update: XOR<MapUpdateWithoutCultureInput, MapUncheckedUpdateWithoutCultureInput>
    create: XOR<MapCreateWithoutCultureInput, MapUncheckedCreateWithoutCultureInput>
    where?: MapWhereInput
  }

  export type MapUpdateToOneWithWhereWithoutCultureInput = {
    where?: MapWhereInput
    data: XOR<MapUpdateWithoutCultureInput, MapUncheckedUpdateWithoutCultureInput>
  }

  export type MapUpdateWithoutCultureInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUpdateManyWithoutMapsNestedInput
    towns?: TownUpdateManyWithoutMapsNestedInput
    villages?: VillageUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUpdateManyWithoutMapsNestedInput
    population?: PopulationUpdateManyWithoutMapsNestedInput
    user?: UserUpdateOneRequiredWithoutMapsNestedInput
  }

  export type MapUncheckedUpdateWithoutCultureInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUncheckedUpdateManyWithoutMapsNestedInput
    towns?: TownUncheckedUpdateManyWithoutMapsNestedInput
    villages?: VillageUncheckedUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUncheckedUpdateManyWithoutMapsNestedInput
    population?: PopulationUncheckedUpdateManyWithoutMapsNestedInput
  }

  export type SessionCreateManyUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
  }

  export type AccountCreateManyUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type MapCreateManyUserInput = {
    id: string
    name: string
    url: string
    description?: string | null
    createdAt?: Date | string | null
    updateAt?: Date | string | null
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MapUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUpdateManyWithoutMapsNestedInput
    towns?: TownUpdateManyWithoutMapsNestedInput
    villages?: VillageUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUpdateManyWithoutMapsNestedInput
    population?: PopulationUpdateManyWithoutMapsNestedInput
    culture?: CultureUpdateManyWithoutMapsNestedInput
  }

  export type MapUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    countries?: CountryUncheckedUpdateManyWithoutMapsNestedInput
    towns?: TownUncheckedUpdateManyWithoutMapsNestedInput
    villages?: VillageUncheckedUpdateManyWithoutMapsNestedInput
    poi?: PointOfInterestUncheckedUpdateManyWithoutMapsNestedInput
    population?: PopulationUncheckedUpdateManyWithoutMapsNestedInput
    culture?: CultureUncheckedUpdateManyWithoutMapsNestedInput
  }

  export type MapUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CountryCreateManyMapsInput = {
    id: string
    name: string
    area: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type TownCreateManyMapsInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VillageCreateManyMapsInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type PointOfInterestCreateManyMapsInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    town: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type PopulationCreateManyMapsInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type CultureCreateManyMapsInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type CountryUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CountryUncheckedUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CountryUncheckedUpdateManyWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TownUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    poi?: PointOfInterestUpdateManyWithoutTownsNestedInput
  }

  export type TownUncheckedUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    poi?: PointOfInterestUncheckedUpdateManyWithoutTownsNestedInput
  }

  export type TownUncheckedUpdateManyWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VillageUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VillageUncheckedUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VillageUncheckedUpdateManyWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PointOfInterestUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    towns?: TownUpdateOneRequiredWithoutPoiNestedInput
  }

  export type PointOfInterestUncheckedUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    town?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PointOfInterestUncheckedUpdateManyWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    town?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PopulationUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PopulationUncheckedUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PopulationUncheckedUpdateManyWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CultureUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CultureUncheckedUpdateWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CultureUncheckedUpdateManyWithoutMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PointOfInterestCreateManyTownsInput = {
    id: string
    name: string
    icon: string
    description?: string | null
    map: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type PointOfInterestUpdateWithoutTownsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maps?: MapUpdateOneRequiredWithoutPoiNestedInput
  }

  export type PointOfInterestUncheckedUpdateWithoutTownsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PointOfInterestUncheckedUpdateManyWithoutTownsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    map?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}