-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: database:3306
-- Tiempo de generación: 16-04-2026 a las 09:42:46
-- Versión del servidor: 8.4.5
-- Versión de PHP: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de datos: `gesportin`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulo`
--

CREATE TABLE `articulo` (
  `id` bigint NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `precio` decimal(38,2) NOT NULL,
  `descuento` decimal(38,2) DEFAULT NULL,
  `imagen` longblob,
  `id_tipoarticulo` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id` bigint NOT NULL,
  `cantidad` int NOT NULL,
  `id_articulo` bigint NOT NULL,
  `id_usuario` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id` bigint NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `id_temporada` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `club`
--

CREATE TABLE `club` (
  `id` bigint NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `dirección` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `teléfono` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `fecha_alta` datetime NOT NULL,
  `imagen` longblob
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

--
-- Volcado de datos para la tabla `club`
--

INSERT INTO `club` (`id`, `nombre`, `dirección`, `teléfono`, `fecha_alta`, `imagen`) VALUES
(1, 'Gesportin', '', '', '2026-04-16 09:41:26', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `id` bigint NOT NULL,
  `contenido` varchar(1024) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `id_noticia` bigint NOT NULL,
  `id_usuario` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarioart`
--

CREATE TABLE `comentarioart` (
  `id` bigint NOT NULL,
  `contenido` varchar(1024) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `id_articulo` bigint NOT NULL,
  `id_usuario` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `id` bigint NOT NULL,
  `cantidad` int NOT NULL,
  `precio` double NOT NULL,
  `id_articulo` bigint NOT NULL,
  `id_factura` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuota`
--

CREATE TABLE `cuota` (
  `id` bigint NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `cantidad` decimal(38,2) NOT NULL,
  `fecha` datetime NOT NULL,
  `id_equipo` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo`
--

CREATE TABLE `equipo` (
  `id` bigint NOT NULL,
  `nombre` varchar(1024) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `id_entrenador` bigint NOT NULL,
  `id_categoria` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadopartido`
--

CREATE TABLE `estadopartido` (
  `id` bigint NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

--
-- Volcado de datos para la tabla `estadopartido`
--

INSERT INTO `estadopartido` (`id`, `descripcion`) VALUES
(1, 'No jugado'),
(2, 'Aplazado'),
(3, 'Ganado'),
(4, 'Perdido'),
(5, 'Empatado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id` bigint NOT NULL,
  `fecha` datetime NOT NULL,
  `id_usuario` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugador`
--

CREATE TABLE `jugador` (
  `id` bigint NOT NULL,
  `dorsal` int NOT NULL,
  `posicion` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `capitan` tinyint(1) NOT NULL DEFAULT '0',
  `imagen` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci DEFAULT NULL,
  `id_usuario` bigint NOT NULL,
  `id_equipo` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `liga`
--

CREATE TABLE `liga` (
  `id` bigint NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `id_equipo` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticia`
--

CREATE TABLE `noticia` (
  `id` bigint NOT NULL,
  `titulo` varchar(1024) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `contenido` text CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `imagen` longblob,
  `id_club` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `id` bigint NOT NULL,
  `id_cuota` bigint NOT NULL,
  `id_jugador` bigint NOT NULL,
  `abonado` bit(1) NOT NULL,
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partido`
--

CREATE TABLE `partido` (
  `id` bigint NOT NULL,
  `rival` varchar(1024) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `id_liga` bigint NOT NULL,
  `local` tinyint(1) NOT NULL,
  `resultado` varchar(1024) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `lugar` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `id_estadopartido` bigint DEFAULT NULL,
  `comentario` text COLLATE utf32_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntuacion`
--

CREATE TABLE `puntuacion` (
  `id` bigint NOT NULL,
  `puntuacion` int NOT NULL,
  `id_noticia` bigint NOT NULL,
  `id_usuario` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntuacionart`
--

CREATE TABLE `puntuacionart` (
  `id` bigint NOT NULL,
  `puntuacion` int NOT NULL,
  `id_articulo` bigint NOT NULL,
  `id_usuario` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rolusuario`
--

CREATE TABLE `rolusuario` (
  `id` bigint NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

--
-- Volcado de datos para la tabla `rolusuario`
--

INSERT INTO `rolusuario` (`id`, `descripcion`) VALUES
(1, 'Presidente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `temporada`
--

CREATE TABLE `temporada` (
  `id` bigint NOT NULL,
  `descripcion` varchar(256) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `id_club` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipoarticulo`
--

CREATE TABLE `tipoarticulo` (
  `id` bigint NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `id_club` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipousuario`
--

CREATE TABLE `tipousuario` (
  `id` bigint NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

--
-- Volcado de datos para la tabla `tipousuario`
--

INSERT INTO `tipousuario` (`id`, `descripcion`) VALUES
(1, 'Administrador'),
(2, 'Administrador de club'),
(3, 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` bigint NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `apellido1` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `apellido2` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `fecha_alta` datetime NOT NULL,
  `genero` int NOT NULL,
  `id_tipousuario` bigint NOT NULL,
  `id_club` bigint NOT NULL,
  `id_rolusuario` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `apellido1`, `apellido2`, `username`, `password`, `fecha_alta`, `genero`, `id_tipousuario`, `id_club`, `id_rolusuario`) VALUES
(1, 'Jose', 'Gutiérrez', 'Cruz', 'admin', '7e4b4f5529e084ecafb996c891cfbd5b5284f5b00dc155c37bbb62a9f161a72e', '2026-03-30 15:57:44', 0, 1, 1, 1),
(2, 'Maria', 'García', 'López', 'clubadmin', '7e4b4f5529e084ecafb996c891cfbd5b5284f5b00dc155c37bbb62a9f161a72e', '2026-03-30 15:57:44', 1, 2, 1, 1),
(3, 'Carla', 'Sánchez', 'Martínez', 'usuario', '7e4b4f5529e084ecafb996c891cfbd5b5284f5b00dc155c37bbb62a9f161a72e', '2026-03-30 15:57:44', 1, 3, 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `articulo`
--
ALTER TABLE `articulo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKsonjnqwy0gt39ls91v17nfwxr` (`id_tipoarticulo`);

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKcvhp849os0y4eck4jlwa8261f` (`id_articulo`),
  ADD KEY `FKsbqpxk63xrpyck17xawl195dt` (`id_usuario`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK5wso2m2cs9a5auxbyeug1svb4` (`id_temporada`);

--
-- Indices de la tabla `club`
--
ALTER TABLE `club`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKnfm3aid676kgfv2eghlcspkhy` (`id_noticia`),
  ADD KEY `FK9619kv3mim3a4yl0m5mdhhbh1` (`id_usuario`);

--
-- Indices de la tabla `comentarioart`
--
ALTER TABLE `comentarioart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK2txo6h8k70f1hnrhfndyks0k6` (`id_articulo`),
  ADD KEY `FKhjvsujewps75ag506ll0nhxbr` (`id_usuario`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK45tujme9940nngjl3ymboryi3` (`id_articulo`),
  ADD KEY `FKl23p4v9d3lg9vjthecu8i7ixv` (`id_factura`);

--
-- Indices de la tabla `cuota`
--
ALTER TABLE `cuota`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKor7b2a0afrseeu7mk6ctjcj13` (`id_equipo`);

--
-- Indices de la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK6ctox2d99lgj2v105weg7ed5e` (`id_categoria`),
  ADD KEY `FKp0b0mujjs0hljr6sbtopjgvyw` (`id_entrenador`);

--
-- Indices de la tabla `estadopartido`
--
ALTER TABLE `estadopartido`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK20l7cekp55mhbab3q09tx9ato` (`id_usuario`);

--
-- Indices de la tabla `jugador`
--
ALTER TABLE `jugador`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKi60lqb7emposedyui33q42u1i` (`id_equipo`),
  ADD KEY `FK4l9civft8pub4je5v0009m858` (`id_usuario`);

--
-- Indices de la tabla `liga`
--
ALTER TABLE `liga`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKc93itu3ascstblg0d1taxr2s8` (`id_equipo`);

--
-- Indices de la tabla `noticia`
--
ALTER TABLE `noticia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKm1t6gdjqk9qbxtymfsrl5w38y` (`id_club`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKonch4hy8el3uyqxm2497mdal4` (`id_cuota`),
  ADD KEY `FKlj1d0yxpgf7kh9ykelhqrqs53` (`id_jugador`);

--
-- Indices de la tabla `partido`
--
ALTER TABLE `partido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK7vih20gd7qjugbdwwhujxvi7o` (`id_liga`);

--
-- Indices de la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKtfmyqw629wh8d3i066yq3qrxl` (`id_noticia`),
  ADD KEY `FKq7vc8i3j171whn8lpswgcgyrj` (`id_usuario`);

--
-- Indices de la tabla `puntuacionart`
--
ALTER TABLE `puntuacionart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK2oufenj1rtondmqu13a0lx619` (`id_articulo`),
  ADD KEY `FKpm5b083nr6w0nx6avj6xv4xb` (`id_usuario`);

--
-- Indices de la tabla `rolusuario`
--
ALTER TABLE `rolusuario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `temporada`
--
ALTER TABLE `temporada`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK4t1e3bqht94swpkrjpqrifpcj` (`id_club`);

--
-- Indices de la tabla `tipoarticulo`
--
ALTER TABLE `tipoarticulo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKijded6ap2rqhu65qtlsypkkt8` (`id_club`);

--
-- Indices de la tabla `tipousuario`
--
ALTER TABLE `tipousuario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKfwlv0l9is3cqh8svkypwbswlg` (`id_club`),
  ADD KEY `FKbv8uo5bh4gauhgjh4vycu2a5e` (`id_rolusuario`),
  ADD KEY `FK142plrytoogsme2hd0d9xm7c0` (`id_tipousuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `articulo`
--
ALTER TABLE `articulo`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `club`
--
ALTER TABLE `club`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comentarioart`
--
ALTER TABLE `comentarioart`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cuota`
--
ALTER TABLE `cuota`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `equipo`
--
ALTER TABLE `equipo`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estadopartido`
--
ALTER TABLE `estadopartido`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jugador`
--
ALTER TABLE `jugador`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `liga`
--
ALTER TABLE `liga`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `noticia`
--
ALTER TABLE `noticia`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `partido`
--
ALTER TABLE `partido`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puntuacionart`
--
ALTER TABLE `puntuacionart`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rolusuario`
--
ALTER TABLE `rolusuario`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `temporada`
--
ALTER TABLE `temporada`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipoarticulo`
--
ALTER TABLE `tipoarticulo`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipousuario`
--
ALTER TABLE `tipousuario`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=205;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje_chat`
--

CREATE TABLE `mensaje_chat` (
  `id` bigint NOT NULL,
  `contenido` text CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `fecha_envio` datetime NOT NULL,
  `id_club` bigint NOT NULL,
  `id_usuario` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

--
-- Índices de la tabla `mensaje_chat`
--
ALTER TABLE `mensaje_chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mc_club` (`id_club`),
  ADD KEY `idx_mc_usuario` (`id_usuario`);

--
-- AUTO_INCREMENT de la tabla `mensaje_chat`
--
ALTER TABLE `mensaje_chat`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `mensaje_chat`
--
ALTER TABLE `mensaje_chat`
  ADD CONSTRAINT `fk_mc_club` FOREIGN KEY (`id_club`) REFERENCES `club` (`id`),
  ADD CONSTRAINT `fk_mc_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

-- --------------------------------------------------------

--
-- 10 clubs adicionales
--
INSERT INTO `club` (`id`, `nombre`, `dirección`, `teléfono`, `fecha_alta`, `imagen`) VALUES
(2,  'Club Deportivo Valencia',  'Av. Aragón, 30, Valencia',     '960000002', '2026-05-17 00:00:00', NULL),
(3,  'Atlético Castellón',       'Calle Mayor, 12, Castellón',   '960000003', '2026-05-17 00:00:00', NULL),
(4,  'Real Alicante CF',         'Av. del Mar, 5, Alicante',     '960000004', '2026-05-17 00:00:00', NULL),
(5,  'CD Sagunto',               'Calle Roma, 8, Sagunto',       '960000005', '2026-05-17 00:00:00', NULL),
(6,  'UD Gandía',                'Passeig Germanies, 22, Gandía','960000006', '2026-05-17 00:00:00', NULL),
(7,  'Club Baloncesto Elche',    'Calle Filet de Fora, 3, Elche','960000007', '2026-05-17 00:00:00', NULL),
(8,  'CD Torrent',               'Av. al Vedat, 90, Torrent',    '960000008', '2026-05-17 00:00:00', NULL),
(9,  'Vila-real Sport Club',     'Calle Cervantes, 14, Vila-real','960000009','2026-05-17 00:00:00', NULL),
(10, 'CF Dénia',                 'Calle La Mar, 40, Dénia',      '960000010', '2026-05-17 00:00:00', NULL),
(11, 'Club Náutico Cullera',     'Passeig Marítim, 1, Cullera',  '960000011', '2026-05-17 00:00:00', NULL);

--
-- 10 usuarios (uno por club nuevo). Tipo 2 = Administrador de club, rol 1 = Presidente.
-- Contraseña en claro: 12345  ->  SHA-256: 5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5
--
INSERT INTO `usuario` (`id`, `nombre`, `apellido1`, `apellido2`, `username`, `password`, `fecha_alta`, `genero`, `id_tipousuario`, `id_club`, `id_rolusuario`) VALUES
(205, 'Pablo',  'Martín',    'Ruiz',     'pablo.martin',     '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '2026-05-17 00:00:00', 0, 2, 2,  1),
(206, 'Lucía',  'Fernández', 'Gómez',    'lucia.fernandez',  '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '2026-05-17 00:00:00', 1, 2, 3,  1),
(207, 'Hugo',   'López',     'Díaz',     'hugo.lopez',       '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '2026-05-17 00:00:00', 0, 2, 4,  1),
(208, 'Sara',   'Moreno',    'Jiménez',  'sara.moreno',      '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '2026-05-17 00:00:00', 1, 2, 5,  1),
(209, 'Diego',  'Álvarez',   'Romero',   'diego.alvarez',    '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '2026-05-17 00:00:00', 0, 2, 6,  1),
(210, 'Marta',  'Navarro',   'Torres',   'marta.navarro',    '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '2026-05-17 00:00:00', 1, 2, 7,  1),
(211, 'Javier', 'Domínguez', 'Vázquez',  'javier.dominguez', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '2026-05-17 00:00:00', 0, 2, 8,  1),
(212, 'Elena',  'Gil',       'Serrano',  'elena.gil',        '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '2026-05-17 00:00:00', 1, 2, 9,  1),
(213, 'Carlos', 'Ramos',     'Castro',   'carlos.ramos',     '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '2026-05-17 00:00:00', 0, 2, 10, 1),
(214, 'Nuria',  'Ortega',    'Rubio',    'nuria.ortega',     '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '2026-05-17 00:00:00', 1, 2, 11, 1);

--
-- Usuario adicional en el club 2 (Club Deportivo Valencia, mismo club que pablo.martin).
-- Tipo 3 = Usuario. Contraseña en claro: 12345
--
INSERT INTO `usuario` (`id`, `nombre`, `apellido1`, `apellido2`, `username`, `password`, `fecha_alta`, `genero`, `id_tipousuario`, `id_club`, `id_rolusuario`) VALUES
(215, 'Ana', 'Torres', 'Beltrán', 'ana.torres', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '2026-05-17 00:00:00', 1, 3, 2, 1);

COMMIT;
