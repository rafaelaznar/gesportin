-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: database:3306
-- Tiempo de generación: 08-01-2026 a las 07:53:16
-- Versión del servidor: 8.4.6
-- Versión de PHP: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de datos: `esportin`
--

-- --------------------------------------------------------


CREATE TABLE `equipo` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf32_unicode_ci NOT NULL,
  `id_club` bigint NOT NULL,
  `id_entrenador` bigint NOT NULL,
  `id_categoria` bigint NOT NULL,
  `id_liga` bigint NOT NULL,
  `id_temporada` bigint NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;


CREATE TABLE jugador (
  id BIGINT NOT NULL AUTO_INCREMENT,
  dorsal INT NOT NULL,
  posicion VARCHAR(50) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  capitan TINYINT(1) NOT NULL DEFAULT 0,
  imagen VARCHAR(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci DEFAULT NULL,
  id_usuario BIGINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;


--Tabla tipo usuario Marcos
CREATE TABLE `tipo_usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Estructura de tabla para la tabla `temporada` (Alejandro Pavón Martínez)
--

CREATE TABLE `temporada` (
  `id` bigint NOT NULL,
  `descripcion` varchar(256) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;



-- Vladislav Uski
CREATE TABLE `noticia` (
  `id` bigint NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `contenido` text NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `imagen` longblob,
  `id_club` bigint  NOT NULL,

  FOREIGN KEY (`id_club`) REFERENCES `club` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `puntuacion` (
  `id` bigint NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `puntuacion` tinyint NOT NULL,
  `id_articulo` bigint NOT NULL,
  `id_usuario` bigint NOT NULL,

  FOREIGN KEY (`id_articulo`) REFERENCES `articulo` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf32_unicode_ci NOT NULL,
  PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

CREATE TABLE `partido` (
  `id` bigint NOT NULL,
  `nombre_rival` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `id_equipo` bigint NOT NULL,
  `local` tinyint(1) NOT NULL,
  `resultado` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

ALTER TABLE `partido`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `partido`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

CREATE TABLE `Tipoarticulo` (
  `id` bigint NOT NULL,
  `descripcion` varchar(255) COLLATE utf32_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

ALTER TABLE `Tipoarticulo`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `Tipoarticulo`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `temporada`
--
ALTER TABLE `temporada`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `temporada`
--
ALTER TABLE `temporada`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;
  
  
COMMIT;
