-- =====================================================================
-- Gesportín — Seed para el Dashboard
-- =====================================================================
-- Pobla el club id=1 (Gesportin) con 2 temporadas y datos abundantes
-- para que /dashboard/admin, /dashboard/teamadmin y /mi/dashboard
-- muestren KPIs, gráficas y tabla con valores reales.
--
-- No borra nada. IDs explícitos partiendo de los AUTO_INCREMENT actuales
-- de tu BD:
--   temporada=11  categoria=11  equipo=4   liga=11    jugador=4
--   cuota=11      pago=8        partido=11 noticia=11 usuario=14
--
-- Carla (usuario id=3, rol Usuario) se inscribe en 2 equipos para que
-- /mi/dashboard muestre datos suyos.
--
-- Ejecuta el script ENTERO de una sola vez (es atómico, START TRANSACTION).
-- =====================================================================

USE gesportin;

START TRANSACTION;

SET @PWD = '7e4b4f5529e084ecafb996c891cfbd5b5284f5b00dc155c37bbb62a9f161a72e';

-- ---------------------------------------------------------------------
-- 1) TEMPORADAS para club 1 (Gesportin)
-- ---------------------------------------------------------------------
INSERT INTO temporada (id, descripcion, id_club) VALUES
(11, 'Temporada Liga 2025-2026', 1),  -- actual (default del dashboard)
(12, 'Temporada Liga 2024-2025', 1);  -- histórica

-- ---------------------------------------------------------------------
-- 2) CATEGORÍAS (4 por temporada → G1 mostrará 4 barras)
-- ---------------------------------------------------------------------
INSERT INTO categoria (id, nombre, id_temporada) VALUES
(11, 'Benjamín', 11), (12, 'Alevín', 11), (13, 'Infantil', 11), (14, 'Cadete', 11),
(15, 'Benjamín', 12), (16, 'Alevín', 12), (17, 'Infantil', 12), (18, 'Cadete', 12);

-- ---------------------------------------------------------------------
-- 3) USUARIOS adicionales — 4 entrenadores (tipo=2) + 28 jugadores (tipo=3)
--    rolusuario: 10=Entrenador, 5=Jugador
-- ---------------------------------------------------------------------
INSERT INTO usuario (id, nombre, apellido1, apellido2, username, password, fecha_alta, genero, id_tipousuario, id_club, id_rolusuario) VALUES
-- Entrenadores
(14, 'Pedro',   'Ruiz',      'Vidal',     'dash_ent1', @PWD, '2025-08-01 09:00:00', 0, 2, 1, 10),
(15, 'Lucía',   'Hernández', 'Ortega',    'dash_ent2', @PWD, '2025-08-01 09:00:00', 1, 2, 1, 10),
(16, 'Mario',   'Soler',     'Navarro',   'dash_ent3', @PWD, '2025-08-01 09:00:00', 0, 2, 1, 10),
(17, 'Sara',    'Castro',    'Mora',      'dash_ent4', @PWD, '2025-08-01 09:00:00', 1, 2, 1, 10),
-- Jugadores temporada actual (24 jugadores: equipos 4..9)
(18, 'Alex',    'Méndez',    'Fernández', 'dash_jug01', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(19, 'Pablo',   'Díaz',      'Romero',    'dash_jug02', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(20, 'Hugo',    'Vega',      'Marín',     'dash_jug03', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(21, 'Daniel',  'Ortiz',     'Suárez',    'dash_jug04', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(22, 'Adrián',  'Cruz',      'Pina',      'dash_jug05', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(23, 'Marc',    'Reyes',     'Calvo',     'dash_jug06', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(24, 'Bruno',   'Soria',     'Esteban',   'dash_jug07', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(25, 'Nicolás', 'Aragón',    'Peña',      'dash_jug08', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(26, 'Óscar',   'Mora',      'Salas',     'dash_jug09', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(27, 'Sergio',  'Ibarra',    'Lara',      'dash_jug10', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(28, 'Javier',  'Pardo',     'Vargas',    'dash_jug11', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(29, 'Álvaro',  'Galán',     'Heredia',   'dash_jug12', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(30, 'Mateo',   'Bravo',     'Cano',      'dash_jug13', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(31, 'Rubén',   'Mendoza',   'Torres',    'dash_jug14', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(32, 'Eric',    'Caballero', 'Polo',      'dash_jug15', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(33, 'Aitor',   'Reverte',   'Lozano',    'dash_jug16', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(34, 'Joel',    'Quintero',  'Jurado',    'dash_jug17', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(35, 'Darío',   'Salinas',   'Belmonte',  'dash_jug18', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(36, 'Iván',    'Lago',      'Crespo',    'dash_jug19', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(37, 'Lluc',    'Espí',      'Ruano',     'dash_jug20', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(38, 'Izan',    'Romeu',     'Barba',     'dash_jug21', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(39, 'Pau',     'Castell',   'Verdú',     'dash_jug22', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(40, 'Saúl',    'Trillo',    'Gascón',    'dash_jug23', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
(41, 'Biel',    'Ramos',     'Tomás',     'dash_jug24', @PWD, '2025-09-01 09:00:00', 0, 3, 1, 5),
-- Jugadores temporada histórica
(42, 'Roque',   'Asensi',    'Vidal',     'dash_jug25', @PWD, '2024-09-01 09:00:00', 0, 3, 1, 5),
(43, 'Tomás',   'Bonet',     'Roig',      'dash_jug26', @PWD, '2024-09-01 09:00:00', 0, 3, 1, 5),
(44, 'Ismael',  'Sanchis',   'Aliaga',    'dash_jug27', @PWD, '2024-09-01 09:00:00', 0, 3, 1, 5),
(45, 'Jorge',   'Pomar',     'Donat',     'dash_jug28', @PWD, '2024-09-01 09:00:00', 0, 3, 1, 5);

-- ---------------------------------------------------------------------
-- 4) EQUIPOS (6 actual + 3 histórica)
-- ---------------------------------------------------------------------
INSERT INTO equipo (id, nombre, id_categoria, id_entrenador) VALUES
-- Temporada actual
( 4, 'Halcones Benjamín',  11, 14),
( 5, 'Águilas Benjamín',   11, 15),
( 6, 'Lobos Alevín',       12, 16),
( 7, 'Tigres Alevín',      12, 17),
( 8, 'Leones Infantil',    13, 14),  -- Carla aquí
( 9, 'Panteras Cadete',    14, 16),  -- Carla aquí
-- Temporada histórica
(10, 'Halcones 24-25',     15, 14),
(11, 'Lobos 24-25',        16, 16),
(12, 'Leones 24-25',       17, 17);

-- ---------------------------------------------------------------------
-- 5) LIGAS (1 por equipo)
-- ---------------------------------------------------------------------
INSERT INTO liga (id, nombre, id_equipo) VALUES
(11, 'Liga Benjamín Grupo A',      4),
(12, 'Liga Benjamín Grupo B',      5),
(13, 'Liga Alevín Grupo A',        6),
(14, 'Liga Alevín Grupo B',        7),
(15, 'Liga Infantil Provincial',   8),
(16, 'Liga Cadete Provincial',     9),
(17, 'Liga Benjamín 24-25',       10),
(18, 'Liga Alevín 24-25',         11),
(19, 'Liga Infantil 24-25',       12);

-- ---------------------------------------------------------------------
-- 6) JUGADORES (30 — Carla incluida en eq 8 y eq 9)
-- ---------------------------------------------------------------------
INSERT INTO jugador (id, dorsal, posicion, capitan, imagen, id_usuario, id_equipo) VALUES
-- Eq 4 (Halcones Benjamín) — 4 jugadores
( 4,  1, 'Portero',        1, NULL, 18, 4),
( 5,  4, 'Defensa',        0, NULL, 19, 4),
( 6,  9, 'Delantero',      0, NULL, 20, 4),
( 7, 10, 'Centrocampista', 0, NULL, 21, 4),
-- Eq 5 (Águilas Benjamín) — 4 jugadores
( 8,  1, 'Portero',        1, NULL, 22, 5),
( 9,  3, 'Defensa',        0, NULL, 23, 5),
(10,  7, 'Delantero',      0, NULL, 24, 5),
(11, 11, 'Centrocampista', 0, NULL, 25, 5),
-- Eq 6 (Lobos Alevín) — 4 jugadores
(12,  1, 'Portero',        1, NULL, 26, 6),
(13,  5, 'Defensa',        0, NULL, 27, 6),
(14,  8, 'Centrocampista', 0, NULL, 28, 6),
(15,  9, 'Delantero',      0, NULL, 29, 6),
-- Eq 7 (Tigres Alevín) — 3 jugadores
(16,  1, 'Portero',        1, NULL, 30, 7),
(17,  6, 'Centrocampista', 0, NULL, 31, 7),
(18,  9, 'Delantero',      0, NULL, 32, 7),
-- Eq 8 (Leones Infantil) — 4 jugadores + Carla
(19,  1, 'Portero',        1, NULL, 33, 8),
(20,  4, 'Defensa',        0, NULL, 34, 8),
(21,  8, 'Centrocampista', 0, NULL, 35, 8),
(22,  9, 'Delantero',      0, NULL, 36, 8),
(23,  7, 'Extremo',        0, NULL,  3, 8),   -- Carla
-- Eq 9 (Panteras Cadete) — 3 jugadores + Carla
(24,  1, 'Portero',        1, NULL, 37, 9),
(25,  5, 'Defensa',        0, NULL, 38, 9),
(26,  9, 'Delantero',      0, NULL, 39, 9),
(27, 10, 'Capitana',       0, NULL,  3, 9),   -- Carla
-- Eq 10 (Halcones 24-25)
(28,  1, 'Portero',        1, NULL, 40, 10),
(29,  9, 'Delantero',      0, NULL, 41, 10),
-- Eq 11 (Lobos 24-25)
(30,  1, 'Portero',        1, NULL, 42, 11),
(31,  9, 'Delantero',      0, NULL, 43, 11),
-- Eq 12 (Leones 24-25)
(32,  1, 'Portero',        1, NULL, 44, 12),
(33,  9, 'Delantero',      0, NULL, 45, 12);

-- ---------------------------------------------------------------------
-- 7) CUOTAS — distribuidas por meses para G4 ingresos-mensuales
-- ---------------------------------------------------------------------
INSERT INTO cuota (id, descripcion, cantidad, fecha, id_equipo) VALUES
-- Eq 4 — 5 cuotas
(11, 'Inscripción 25-26', 150.00, '2025-09-05 10:00:00', 4),
(12, 'Cuota Octubre',      50.00, '2025-10-05 10:00:00', 4),
(13, 'Cuota Noviembre',    50.00, '2025-11-05 10:00:00', 4),
(14, 'Cuota Diciembre',    50.00, '2025-12-05 10:00:00', 4),
(15, 'Cuota Enero',        50.00, '2026-01-05 10:00:00', 4),
-- Eq 5 — 5 cuotas
(16, 'Inscripción 25-26', 150.00, '2025-09-05 10:00:00', 5),
(17, 'Cuota Octubre',      50.00, '2025-10-05 10:00:00', 5),
(18, 'Cuota Noviembre',    50.00, '2025-11-05 10:00:00', 5),
(19, 'Cuota Diciembre',    50.00, '2025-12-05 10:00:00', 5),
(20, 'Cuota Enero',        50.00, '2026-01-05 10:00:00', 5),
-- Eq 6 — 5 cuotas
(21, 'Inscripción 25-26', 180.00, '2025-09-10 10:00:00', 6),
(22, 'Cuota Octubre',      60.00, '2025-10-10 10:00:00', 6),
(23, 'Cuota Noviembre',    60.00, '2025-11-10 10:00:00', 6),
(24, 'Cuota Diciembre',    60.00, '2025-12-10 10:00:00', 6),
(25, 'Cuota Enero',        60.00, '2026-01-10 10:00:00', 6),
-- Eq 7 — 5 cuotas
(26, 'Inscripción 25-26', 180.00, '2025-09-12 10:00:00', 7),
(27, 'Cuota Octubre',      60.00, '2025-10-12 10:00:00', 7),
(28, 'Cuota Noviembre',    60.00, '2025-11-12 10:00:00', 7),
(29, 'Cuota Diciembre',    60.00, '2025-12-12 10:00:00', 7),
(30, 'Cuota Enero',        60.00, '2026-01-12 10:00:00', 7),
-- Eq 8 — 5 cuotas
(31, 'Inscripción 25-26', 200.00, '2025-09-15 10:00:00', 8),
(32, 'Cuota Octubre',      70.00, '2025-10-15 10:00:00', 8),
(33, 'Cuota Noviembre',    70.00, '2025-11-15 10:00:00', 8),
(34, 'Cuota Diciembre',    70.00, '2025-12-15 10:00:00', 8),
(35, 'Cuota Enero',        70.00, '2026-01-15 10:00:00', 8),
-- Eq 9 — 5 cuotas
(36, 'Inscripción 25-26', 220.00, '2025-09-20 10:00:00', 9),
(37, 'Cuota Octubre',      80.00, '2025-10-20 10:00:00', 9),
(38, 'Cuota Noviembre',    80.00, '2025-11-20 10:00:00', 9),
(39, 'Cuota Diciembre',    80.00, '2025-12-20 10:00:00', 9),
(40, 'Cuota Enero',        80.00, '2026-01-20 10:00:00', 9),
-- Eq 10 — 3 cuotas histórica
(41, 'Inscripción 24-25', 140.00, '2024-09-05 10:00:00', 10),
(42, 'Cuota Oct 24',       45.00, '2024-10-05 10:00:00', 10),
(43, 'Cuota Nov 24',       45.00, '2024-11-05 10:00:00', 10),
-- Eq 11 — 3 cuotas histórica
(44, 'Inscripción 24-25', 170.00, '2024-09-10 10:00:00', 11),
(45, 'Cuota Oct 24',       55.00, '2024-10-10 10:00:00', 11),
(46, 'Cuota Nov 24',       55.00, '2024-11-10 10:00:00', 11),
-- Eq 12 — 3 cuotas histórica
(47, 'Inscripción 24-25', 190.00, '2024-09-15 10:00:00', 12),
(48, 'Cuota Oct 24',       65.00, '2024-10-15 10:00:00', 12),
(49, 'Cuota Nov 24',       65.00, '2024-11-15 10:00:00', 12);

-- ---------------------------------------------------------------------
-- 8) PAGOS — mezcla pagados (b'1') / pendientes (b'0')
--    Sin IDs explícitos (auto-increment desde 8).
-- ---------------------------------------------------------------------
-- Eq 4 (Halcones B) — jug 4,5,6,7 / cuotas 11..15
INSERT INTO pago (id_cuota, id_jugador, abonado, fecha) VALUES
(11, 4, b'1', '2025-09-06 10:00:00'), (11, 5, b'1', '2025-09-08 10:00:00'),
(11, 6, b'1', '2025-09-10 10:00:00'), (11, 7, b'1', '2025-09-12 10:00:00'),
(12, 4, b'1', '2025-10-06 10:00:00'), (12, 5, b'1', '2025-10-08 10:00:00'),
(12, 6, b'1', '2025-10-10 10:00:00'), (12, 7, b'0', '2025-10-15 10:00:00'),
(13, 4, b'1', '2025-11-06 10:00:00'), (13, 5, b'1', '2025-11-08 10:00:00'),
(13, 6, b'0', '2025-11-15 10:00:00'), (13, 7, b'0', '2025-11-20 10:00:00'),
(14, 4, b'1', '2025-12-06 10:00:00'), (14, 5, b'1', '2025-12-08 10:00:00'),
(14, 6, b'1', '2025-12-10 10:00:00'), (14, 7, b'0', '2025-12-15 10:00:00'),
(15, 4, b'1', '2026-01-06 10:00:00'), (15, 5, b'0', '2026-01-15 10:00:00'),
(15, 6, b'0', '2026-01-18 10:00:00'), (15, 7, b'0', '2026-01-20 10:00:00');

-- Eq 5 (Águilas B) — jug 8..11 / cuotas 16..20
INSERT INTO pago (id_cuota, id_jugador, abonado, fecha) VALUES
(16,  8, b'1', '2025-09-08 10:00:00'), (16,  9, b'1', '2025-09-10 10:00:00'),
(16, 10, b'1', '2025-09-12 10:00:00'), (16, 11, b'1', '2025-09-14 10:00:00'),
(17,  8, b'1', '2025-10-08 10:00:00'), (17,  9, b'1', '2025-10-10 10:00:00'),
(17, 10, b'0', '2025-10-15 10:00:00'), (17, 11, b'1', '2025-10-18 10:00:00'),
(18,  8, b'1', '2025-11-08 10:00:00'), (18,  9, b'0', '2025-11-15 10:00:00'),
(18, 10, b'1', '2025-11-18 10:00:00'), (18, 11, b'0', '2025-11-22 10:00:00'),
(19,  8, b'1', '2025-12-08 10:00:00'), (19,  9, b'0', '2025-12-15 10:00:00'),
(19, 10, b'0', '2025-12-18 10:00:00'), (19, 11, b'1', '2025-12-22 10:00:00'),
(20,  8, b'1', '2026-01-08 10:00:00'), (20,  9, b'0', '2026-01-15 10:00:00'),
(20, 10, b'0', '2026-01-18 10:00:00'), (20, 11, b'0', '2026-01-22 10:00:00');

-- Eq 6 (Lobos A) — jug 12..15 / cuotas 21..25
INSERT INTO pago (id_cuota, id_jugador, abonado, fecha) VALUES
(21, 12, b'1', '2025-09-11 10:00:00'), (21, 13, b'1', '2025-09-13 10:00:00'),
(21, 14, b'1', '2025-09-15 10:00:00'), (21, 15, b'1', '2025-09-17 10:00:00'),
(22, 12, b'1', '2025-10-11 10:00:00'), (22, 13, b'1', '2025-10-13 10:00:00'),
(22, 14, b'1', '2025-10-15 10:00:00'), (22, 15, b'1', '2025-10-17 10:00:00'),
(23, 12, b'1', '2025-11-11 10:00:00'), (23, 13, b'1', '2025-11-13 10:00:00'),
(23, 14, b'0', '2025-11-20 10:00:00'), (23, 15, b'1', '2025-11-22 10:00:00'),
(24, 12, b'1', '2025-12-11 10:00:00'), (24, 13, b'0', '2025-12-20 10:00:00'),
(24, 14, b'0', '2025-12-22 10:00:00'), (24, 15, b'1', '2025-12-24 10:00:00'),
(25, 12, b'1', '2026-01-11 10:00:00'), (25, 13, b'1', '2026-01-13 10:00:00'),
(25, 14, b'0', '2026-01-20 10:00:00'), (25, 15, b'0', '2026-01-22 10:00:00');

-- Eq 7 (Tigres A) — jug 16..18 / cuotas 26..30
INSERT INTO pago (id_cuota, id_jugador, abonado, fecha) VALUES
(26, 16, b'1', '2025-09-13 10:00:00'), (26, 17, b'1', '2025-09-15 10:00:00'),
(26, 18, b'1', '2025-09-17 10:00:00'),
(27, 16, b'1', '2025-10-13 10:00:00'), (27, 17, b'1', '2025-10-15 10:00:00'),
(27, 18, b'0', '2025-10-20 10:00:00'),
(28, 16, b'1', '2025-11-13 10:00:00'), (28, 17, b'0', '2025-11-20 10:00:00'),
(28, 18, b'0', '2025-11-22 10:00:00'),
(29, 16, b'1', '2025-12-13 10:00:00'), (29, 17, b'1', '2025-12-15 10:00:00'),
(29, 18, b'0', '2025-12-22 10:00:00'),
(30, 16, b'1', '2026-01-13 10:00:00'), (30, 17, b'0', '2026-01-20 10:00:00'),
(30, 18, b'0', '2026-01-22 10:00:00');

-- Eq 8 (Leones I) — jug 19..23 (23=Carla) / cuotas 31..35
INSERT INTO pago (id_cuota, id_jugador, abonado, fecha) VALUES
(31, 19, b'1', '2025-09-16 10:00:00'), (31, 20, b'1', '2025-09-18 10:00:00'),
(31, 21, b'1', '2025-09-20 10:00:00'), (31, 22, b'1', '2025-09-22 10:00:00'),
(31, 23, b'1', '2025-09-24 10:00:00'),
(32, 19, b'1', '2025-10-16 10:00:00'), (32, 20, b'1', '2025-10-18 10:00:00'),
(32, 21, b'0', '2025-10-22 10:00:00'), (32, 22, b'1', '2025-10-24 10:00:00'),
(32, 23, b'1', '2025-10-26 10:00:00'),
(33, 19, b'1', '2025-11-16 10:00:00'), (33, 20, b'0', '2025-11-22 10:00:00'),
(33, 21, b'0', '2025-11-24 10:00:00'), (33, 22, b'1', '2025-11-26 10:00:00'),
(33, 23, b'1', '2025-11-28 10:00:00'),
(34, 19, b'1', '2025-12-16 10:00:00'), (34, 20, b'1', '2025-12-18 10:00:00'),
(34, 21, b'0', '2025-12-22 10:00:00'), (34, 22, b'0', '2025-12-24 10:00:00'),
(34, 23, b'0', '2025-12-26 10:00:00'),
(35, 19, b'1', '2026-01-16 10:00:00'), (35, 20, b'0', '2026-01-22 10:00:00'),
(35, 21, b'0', '2026-01-24 10:00:00'), (35, 22, b'1', '2026-01-26 10:00:00'),
(35, 23, b'1', '2026-01-28 10:00:00');

-- Eq 9 (Panteras C) — jug 24..27 (27=Carla) / cuotas 36..40
INSERT INTO pago (id_cuota, id_jugador, abonado, fecha) VALUES
(36, 24, b'1', '2025-09-21 10:00:00'), (36, 25, b'1', '2025-09-23 10:00:00'),
(36, 26, b'1', '2025-09-25 10:00:00'), (36, 27, b'1', '2025-09-27 10:00:00'),
(37, 24, b'1', '2025-10-21 10:00:00'), (37, 25, b'1', '2025-10-23 10:00:00'),
(37, 26, b'0', '2025-10-25 10:00:00'), (37, 27, b'0', '2025-10-27 10:00:00'),
(38, 24, b'1', '2025-11-21 10:00:00'), (38, 25, b'0', '2025-11-25 10:00:00'),
(38, 26, b'0', '2025-11-27 10:00:00'), (38, 27, b'1', '2025-11-29 10:00:00'),
(39, 24, b'1', '2025-12-21 10:00:00'), (39, 25, b'1', '2025-12-23 10:00:00'),
(39, 26, b'0', '2025-12-25 10:00:00'), (39, 27, b'0', '2025-12-27 10:00:00'),
(40, 24, b'1', '2026-01-21 10:00:00'), (40, 25, b'0', '2026-01-25 10:00:00'),
(40, 26, b'0', '2026-01-27 10:00:00'), (40, 27, b'1', '2026-01-29 10:00:00');

-- Eq 10 (Halcones 24-25) — jug 28,29 / cuotas 41..43
INSERT INTO pago (id_cuota, id_jugador, abonado, fecha) VALUES
(41, 28, b'1', '2024-09-06 10:00:00'), (41, 29, b'1', '2024-09-08 10:00:00'),
(42, 28, b'1', '2024-10-06 10:00:00'), (42, 29, b'0', '2024-10-15 10:00:00'),
(43, 28, b'1', '2024-11-06 10:00:00'), (43, 29, b'0', '2024-11-15 10:00:00');

-- Eq 11 (Lobos 24-25) — jug 30,31 / cuotas 44..46
INSERT INTO pago (id_cuota, id_jugador, abonado, fecha) VALUES
(44, 30, b'1', '2024-09-11 10:00:00'), (44, 31, b'1', '2024-09-13 10:00:00'),
(45, 30, b'1', '2024-10-11 10:00:00'), (45, 31, b'1', '2024-10-13 10:00:00'),
(46, 30, b'1', '2024-11-11 10:00:00'), (46, 31, b'0', '2024-11-20 10:00:00');

-- Eq 12 (Leones 24-25) — jug 32,33 / cuotas 47..49
INSERT INTO pago (id_cuota, id_jugador, abonado, fecha) VALUES
(47, 32, b'1', '2024-09-16 10:00:00'), (47, 33, b'1', '2024-09-18 10:00:00'),
(48, 32, b'1', '2024-10-16 10:00:00'), (48, 33, b'0', '2024-10-18 10:00:00'),
(49, 32, b'0', '2024-11-16 10:00:00'), (49, 33, b'0', '2024-11-18 10:00:00');

-- ---------------------------------------------------------------------
-- 9) PARTIDOS — varios estados por mes
--    El StatsService trata: id_estadopartido IN (3,4,5) = jugados;
--      id=3 = victoria; IN (1,2) = pendientes.
-- ---------------------------------------------------------------------
INSERT INTO partido (rival, id_liga, local, resultado, fecha, lugar, id_estadopartido, comentario) VALUES
-- Liga 11 (Halcones B)
('CF Mar',         11, 1, '3-1', '2025-09-15 17:00:00', 'Campo Municipal',   3, 'Victoria sólida'),
('UD Levante B',   11, 0, '1-2', '2025-09-29 17:00:00', 'Campo Visitante',   4, NULL),
('Atlético Norte', 11, 1, '2-2', '2025-10-13 17:00:00', 'Campo Municipal',   5, NULL),
('CD Sur',         11, 0, '4-0', '2025-10-27 17:00:00', 'Campo Visitante',   3, NULL),
('CF Mar',         11, 1, '3-2', '2025-11-10 17:00:00', 'Campo Municipal',   3, NULL),
('UD Levante B',   11, 0, '0-3', '2025-11-24 17:00:00', 'Campo Visitante',   4, NULL),
('Atlético Norte', 11, 1, '5-1', '2025-12-08 17:00:00', 'Campo Municipal',   3, NULL),
('CD Sur',         11, 0, '-',   '2026-01-12 17:00:00', 'Campo Visitante',   2, 'Aplazado por lluvia'),
('CF Mar',         11, 1, '-',   '2026-02-09 17:00:00', 'Campo Municipal',   1, NULL),
('UD Levante B',   11, 0, '-',   '2026-03-09 17:00:00', 'Campo Visitante',   1, NULL),
-- Liga 12 (Águilas B)
('CF Mar',         12, 1, '2-1', '2025-09-20 17:00:00', 'Campo Municipal',   3, NULL),
('UD Levante B',   12, 0, '1-1', '2025-10-18 17:00:00', 'Campo Visitante',   5, NULL),
('Atlético Norte', 12, 1, '0-2', '2025-11-15 17:00:00', 'Campo Municipal',   4, NULL),
('CD Sur',         12, 0, '3-1', '2025-12-13 17:00:00', 'Campo Visitante',   3, NULL),
('CF Mar',         12, 1, '4-2', '2026-01-17 17:00:00', 'Campo Municipal',   3, NULL),
('UD Levante B',   12, 0, '-',   '2026-02-17 17:00:00', 'Campo Visitante',   1, NULL),
-- Liga 13 (Lobos A)
('CB Norte',       13, 1, '4-2', '2025-09-21 18:00:00', 'Polideportivo',     3, NULL),
('CF Este',        13, 0, '1-3', '2025-10-19 18:00:00', 'Campo Visitante',   4, NULL),
('Atlético Oeste', 13, 1, '3-3', '2025-11-16 18:00:00', 'Polideportivo',     5, NULL),
('CB Norte',       13, 0, '2-1', '2025-12-14 18:00:00', 'Campo Visitante',   3, NULL),
('CF Este',        13, 1, '3-0', '2026-01-18 18:00:00', 'Polideportivo',     3, NULL),
('Atlético Oeste', 13, 0, '-',   '2026-02-15 18:00:00', 'Campo Visitante',   2, NULL),
-- Liga 14 (Tigres A)
('CB Norte',       14, 1, '1-1', '2025-09-22 18:00:00', 'Polideportivo',     5, NULL),
('CF Este',        14, 0, '0-2', '2025-10-20 18:00:00', 'Campo Visitante',   4, NULL),
('Atlético Oeste', 14, 1, '2-1', '2025-11-17 18:00:00', 'Polideportivo',     3, NULL),
('CB Norte',       14, 0, '0-0', '2025-12-15 18:00:00', 'Campo Visitante',   5, NULL),
('CF Este',        14, 1, '-',   '2026-01-19 18:00:00', 'Polideportivo',     1, NULL),
-- Liga 15 (Leones I)
('CD Real',        15, 1, '1-0', '2025-09-22 19:00:00', 'Estadio Local',     3, NULL),
('CD Real',        15, 0, '0-1', '2025-10-20 19:00:00', 'Estadio Visitante', 4, NULL),
('CF Castellón',   15, 1, '2-2', '2025-11-17 19:00:00', 'Estadio Local',     5, NULL),
('CF Castellón',   15, 0, '3-2', '2025-12-15 19:00:00', 'Estadio Visitante', 3, NULL),
('CD Real',        15, 1, '4-1', '2026-01-19 19:00:00', 'Estadio Local',     3, NULL),
('CF Castellón',   15, 0, '-',   '2026-02-16 19:00:00', 'Estadio Visitante', 1, NULL),
-- Liga 16 (Panteras C)
('CD Norte',       16, 1, '3-1', '2025-09-28 20:00:00', 'Campo Cadete',      3, NULL),
('CF Sur',         16, 0, '2-2', '2025-10-26 20:00:00', 'Campo Visitante',   5, NULL),
('CD Norte',       16, 1, '1-3', '2025-11-23 20:00:00', 'Campo Cadete',      4, NULL),
('CF Sur',         16, 0, '2-0', '2025-12-21 20:00:00', 'Campo Visitante',   3, NULL),
('CD Norte',       16, 1, '-',   '2026-01-25 20:00:00', 'Campo Cadete',      1, NULL),
-- Liga 17 (Halcones 24-25)
('CF Mar',         17, 1, '2-0', '2024-09-15 17:00:00', 'Campo Municipal',   3, NULL),
('UD Levante B',   17, 0, '1-1', '2024-10-13 17:00:00', 'Campo Visitante',   5, NULL),
('Atlético Norte', 17, 1, '0-2', '2024-11-10 17:00:00', 'Campo Municipal',   4, NULL),
('CD Sur',         17, 0, '3-2', '2024-12-08 17:00:00', 'Campo Visitante',   3, NULL),
-- Liga 18 (Lobos 24-25)
('CB Norte',       18, 1, '4-1', '2024-09-21 18:00:00', 'Polideportivo',     3, NULL),
('CF Este',        18, 0, '0-3', '2024-10-19 18:00:00', 'Campo Visitante',   4, NULL),
('Atlético Oeste', 18, 1, '2-2', '2024-11-16 18:00:00', 'Polideportivo',     5, NULL),
-- Liga 19 (Leones 24-25)
('CD Real',        19, 1, '1-0', '2024-09-22 19:00:00', 'Estadio Local',     3, NULL),
('CD Real',        19, 0, '2-2', '2024-10-20 19:00:00', 'Estadio Visitante', 5, NULL),
('CF Castellón',   19, 1, '3-1', '2024-11-17 19:00:00', 'Estadio Local',     3, NULL);

-- ---------------------------------------------------------------------
-- 10) NOTICIAS del club 1 (KPI K4)
-- ---------------------------------------------------------------------
INSERT INTO noticia (titulo, contenido, fecha, imagen, id_club) VALUES
('Inicio de temporada 2025-2026',  'Arrancamos la nueva temporada con muchos equipos nuevos en el club.',                          '2025-09-01 10:00:00', NULL, 1),
('Halcones Benjamín debutan con victoria', 'Excelente partido del equipo benjamín en su debut liguero, ganando 3-1 al CF Mar.',     '2025-09-16 12:00:00', NULL, 1),
('Convocatoria de pretemporada',   'Convocados todos los jugadores para entrenamiento extra durante la próxima semana.',           '2025-09-25 09:00:00', NULL, 1),
('Resumen del mes de Octubre',     'Resumen mensual de los resultados de todos los equipos del club: 5 victorias y 2 derrotas.',   '2025-10-31 18:00:00', NULL, 1),
('Campaña de cuotas',              'Recordamos la importancia de estar al día con las cuotas mensuales.',                          '2025-11-05 11:00:00', NULL, 1),
('Lobos Alevín, líder del grupo',  'El equipo alevín se consolida en cabeza de la clasificación tras 5 jornadas.',                 '2025-11-20 17:00:00', NULL, 1),
('Resumen del mes de Noviembre',   'Resumen mensual con los partidos disputados en noviembre.',                                    '2025-11-30 18:00:00', NULL, 1),
('Comida de Navidad del Club',     'Os invitamos a la tradicional comida anual del club el 18 de diciembre.',                      '2025-12-10 13:00:00', NULL, 1),
('Felices fiestas',                'El club desea a todos los socios, jugadores y familias unas felices fiestas.',                 '2025-12-22 10:00:00', NULL, 1),
('Vuelta a los entrenamientos',    'Reanudamos toda la actividad deportiva el lunes 8 de enero.',                                  '2026-01-02 09:00:00', NULL, 1),
('Panteras Cadete empatan',        'Reñido empate del cadete frente al CF Sur en un partido muy disputado.',                       '2026-01-15 19:00:00', NULL, 1),
('Aplazamiento por lluvia',        'Se aplaza el partido del benjamín previsto para el sábado por las fuertes lluvias.',           '2026-01-20 12:00:00', NULL, 1);

COMMIT;

-- =====================================================================
-- VERIFICACIÓN — qué debería verse
-- =====================================================================
--   * admin     / admin → /dashboard/admin
--       Dropdown club: 11 clubs (Gesportin entre ellos)
--       Al seleccionar Gesportin: temporadas 11 (default) + 12 + la 1 ya existente
--
--   * clubadmin / admin → /dashboard/teamadmin
--       Dropdown temporada: Liga 2025-2026 (default) | Liga 2024-2025 | Escolar 2019/2020
--       Temporada 11 (default): ~24 jugadores · 6 equipos · 37 partidos
--                                · ~12 noticias · ~115 pagos
--                                · ~6.5k € recibidos · ~2.5k € deuda
--                                · ~28 jugados · ~9 pendientes
--                                · 4 categorías en G1
--       Temporada 12 (histórica): 6 jugadores · 3 equipos · 10 partidos
--
--   * usuario   / admin → /mi/dashboard
--       Carla en Leones Infantil + Panteras Cadete
--       ~10 cuotas (mezcla pagadas/pendientes)
--       Próximos partidos de sus 2 equipos
-- =====================================================================
