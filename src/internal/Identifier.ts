export type mName = string | string[];
export interface IModules {
  [key: string]: IModule;
}
export interface IModule {
  state?;
  mutations?: { [key: string]: (state, payload) => void };
  actions?: { [key: string]: ({ commit, state }, payload) => any };
}
export interface IStoreOps {
  modules?: { [key: string]: IModule };
}
