/**
 * Universal Prisma stub for demo/dev builds.
 * Покрывает prisma.<ЛюбаяМодель>.findMany / findUnique / create / update / delete / count / upsert / aggregate / groupBy.
 * Возвращает безопасные пустые/фиктивные значения.
 */
type Any = any;

function makeModel(name: string) {
  const stamp = () => ({ __stub__: true, __model__: name, id: `${name}_stub_id` });
  return {
    findMany: async (..._args: Any[]) => [],
    findFirst: async (..._args: Any[]) => null,
    findUnique: async (..._args: Any[]) => null,
    create: async (args: Any = {}) => ({ ...stamp(), ...(args?.data ?? {}) }),
    update: async (args: Any = {}) => ({ ...stamp(), ...(args?.data ?? {}) }),
    delete: async (..._args: Any[]) => ({ ...stamp() }),
    count:  async (..._args: Any[]) => 0,
    upsert: async (args: Any = {}) => ({ ...stamp(), ...(args?.create ?? {}), ...(args?.update ?? {}) }),
    aggregate: async (..._args: Any[]) => ({}),
    groupBy: async (..._args: Any[]) => [],
  };
}

// Прокси: любое prisma.<имя> -> мок-модель
export const prisma: Any = new Proxy({}, {
  get(_target, prop: string) {
    // Часто обращаются к $transaction / $disconnect
    if (prop === '$transaction') return async (ops: Any[]) => Promise.all(ops.map((op) => op));
    if (prop === '$disconnect')  return async () => void 0;
    if (prop === '$connect')     return async () => void 0;
    return makeModel(prop);
  },
});

export default prisma;
