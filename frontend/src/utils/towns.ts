import { Region, Town } from '../types/towns';

/* eslint-disable import/prefer-default-export */
export const mapTownToRegion = (town: Town) => {
  const townToRegionMap: Record<Town, Region> = {
    [Town.AMK]: Region.North,
    [Town.BDK]: Region.East,
    [Town.BSH]: Region.North,
    [Town.BBT]: Region.West,
    [Town.BKM]: Region.Central,
    [Town.BKP]: Region.West,
    [Town.BKT]: Region.Central,
    [Town.CEN]: Region.Central,
    [Town.CCK]: Region.West,
    [Town.CLE]: Region.West,
    [Town.GEY]: Region.East,
    [Town.HGN]: Region.NorthEast,
    [Town.JRE]: Region.West,
    [Town.JRW]: Region.West,
    [Town.KAL]: Region.Central,
    [Town.LCK]: Region.North,
    [Town.MPR]: Region.East,
    [Town.PSR]: Region.East,
    [Town.PGL]: Region.NorthEast,
    [Town.QUE]: Region.Central,
    [Town.SBW]: Region.North,
    [Town.SKG]: Region.NorthEast,
    [Town.SER]: Region.NorthEast,
    [Town.TAM]: Region.East,
    [Town.TGH]: Region.West,
    [Town.TAP]: Region.Central,
    [Town.WDL]: Region.North,
    [Town.YIS]: Region.North,
  };

  return townToRegionMap[town];
};
