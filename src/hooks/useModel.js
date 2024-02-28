import { useState } from 'react';

export default function useModel() {
    const [show, setShow] = useState(false);
    const [activeItem, setActiveItem] = useState();

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setActiveItem(values => ({...values, [name]: value}))
    }

    const updateShow = (v) => {
      setShow(v);
    };

    const updateActiveItem = (i) => {
      setActiveItem(i);
    }

    return {
      setShow: updateShow,
      setActiveItem: updateActiveItem,
      handleChange: handleChange,
      show,
      activeItem
    } 
}