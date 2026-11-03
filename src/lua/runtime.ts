import { lua, lauxlib, lualib, to_luastring, to_jsstring } from "fengari";

export interface LuaExecutionResult {
  ok: boolean;
  output: string[];
  error?: string;
}

/** Executes actual Lua source using Fengari, with a deliberately small standard library. */
export function executeLua(source: string): LuaExecutionResult {
  const L = lauxlib.luaL_newstate();
  const output: string[] = [];
  try {
    lualib.luaL_openlibs(L);
    lua.lua_pushjsfunction(L, (state) => {
      const parts: string[] = [];
      const count = lua.lua_gettop(state);
      for (let i = 1; i <= count; i++) {
        lauxlib.luaL_tolstring(state, i);
        parts.push(to_jsstring(lua.lua_tostring(state, -1)));
        lua.lua_pop(state, 1);
      }
      output.push(parts.join("\t"));
      return 0;
    });
    lua.lua_setglobal(L, to_luastring("print"));
    const status = lauxlib.luaL_loadstring(L, to_luastring(source));
    if (status !== lua.LUA_OK) {
      return { ok: false, output, error: to_jsstring(lua.lua_tostring(L, -1)) };
    }
    const runStatus = lua.lua_pcall(L, 0, lua.LUA_MULTRET, 0);
    if (runStatus !== lua.LUA_OK) {
      return { ok: false, output, error: to_jsstring(lua.lua_tostring(L, -1)) };
    }
    return { ok: true, output };
  } finally {
    lua.lua_close(L);
  }
}

export function registerLuaRuntime(): void {
  console.warn("[CCBA] Runtime Lua Fengari preparado.");
}
