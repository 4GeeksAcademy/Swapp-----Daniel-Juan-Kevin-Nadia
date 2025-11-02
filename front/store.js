export const initialStore = () => ({
	usuario: {},
	usuarios: [],
	token: "",
	categorias: []
});

export function storeReducer(store, action = {}) {
	switch (action.type) {
		case "SET_USUARIO":
			return {...store,
				usuario: typeof action.payload === "object" 
					? action.payload 
					: store.usuario
				};
		case "SET_USUARIOS":
			return {
				...store, 
				usuarios: Array.isArray(action.payload) 
					? action.payload 
					: store.usuarios
			};
		case "SET_TOKEN":
			return {...store,
				token: typeof action.payload === "string" 
					? action.payload 
					: store.token
				};
		case "SET_CATEGORIAS":
			return {
				...store, 
				categorias: Array.isArray(action.payload) 
					? action.payload 
					: store.categorias
			};
		default:
			throw new Error("Unknown action type: " + action.type);
	}
};