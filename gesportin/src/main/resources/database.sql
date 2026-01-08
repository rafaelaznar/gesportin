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
