import { lua, lauxlib, lualib, to_luastring, to_jsstring } from "fengari";

export interface LuaExecutionResult { ok: boolean; output: string[]; error?: string; }

/** Executa Lua real via Fengari; bibliotecas de sistema são removidas do ambiente. */
export function executeLua(source: string): LuaExecutionResult {
  const output: string[] = [];
  if (source.length > 12000) return { ok: false, output, error: "Programa excede 12.000 caracteres." };
  const L = lauxlib.luaL_newstate();
  try {
    lualib.luaL_openlibs(L);
    for (const name of ["io", "os", "package", "debug", "dofile", "loadfile"]) {
      lua.lua_pushnil(L); lua.lua_setglobal(L, to_luastring(name));
    }
    lua.lua_pushjsfunction(L, state => {
      const parts: string[] = [];
      for (let i = 1; i <= lua.lua_gettop(state); i++) {
        lauxlib.luaL_tolstring(state, i);
        parts.push(to_jsstring(lua.lua_tostring(state, -1)));
        lua.lua_pop(state, 1);
      }
      output.push(parts.join("\t")); return 0;
    });
    lua.lua_setglobal(L, to_luastring("print"));
    const status = lauxlib.luaL_loadstring(L, to_luastring(source));
    if (status !== lua.LUA_OK) return { ok: false, output, error: to_jsstring(lua.lua_tostring(L, -1)) };
    const runStatus = lauxlib.lua_pcall(L, 0, lua.LUA_MULTRET, 0);
    if (runStatus !== lua.LUA_OK) return { ok: false, output, error: to_jsstring(lua.lua_tostring(L, -1)) };
    return { ok: true, output };
  } finally { lua.lua_close(L); }
}
