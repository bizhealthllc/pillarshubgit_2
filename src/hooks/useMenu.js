import { useState, useEffect } from 'react';
import { Get } from "../hooks/useFetch";
import { GetToken } from "../features/authentication/hooks/useToken";

export default function useMenu() {
  const [loading, setLoading] = useState(false);
  const [error] = useState(false);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    setMenu(() => {
      const storedMenu = GetMenuFromLocalStorage(GetToken()?.environmentId);
      if (storedMenu) {
        return storedMenu;
      } else {
        setLoading(true);
        return undefined;
      }
    })
  }, []);

  useEffect(() => {
    if (menu == undefined) {
      let path = '/api/v1/Menus';

      Get(path, (data) => {
        setLoading(false);
        SetMenuInLocalStorage(data, GetToken()?.environmentId);
        setMenu(data);
      }, () => {
        setLoading(false);
        setMenu([]);
      })
    }
  }, [menu]);

  return { data: menu, loading, error };
}

const memoryStorage = new Map();

function ClearMenu() {
  memoryStorage.clear();
}

function GetMenuFromLocalStorage(key) {
  const tokenString = memoryStorage.get('menu_' + key);
  if (tokenString) {
    return JSON.parse(tokenString)
  }
  return null;
}

function SetMenuInLocalStorage(mnu, key) {
  const menuString = JSON.stringify(mnu);
  memoryStorage.set('menu_' + key, menuString);
}

export { useMenu, ClearMenu };