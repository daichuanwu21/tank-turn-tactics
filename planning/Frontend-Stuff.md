tank object:

```js
{
  uuid: string;
  coordinateX: number; // column, starts from 0, 0 => A (display)
  coordinateY: number; // row, starts from 0, 0 => 1 (display)
  range: number;
  health: number;
  ap?: number;
}
```

redux initial state: Tank[]

actions list:

```
INITIAL_SYNC
ADD_TANK
REMOVE_TANK
UPDATE_TANK (does not include AP, only current player AP is sent)
```
