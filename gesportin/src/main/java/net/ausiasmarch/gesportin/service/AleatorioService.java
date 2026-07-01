package net.ausiasmarch.gesportin.service;

import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class AleatorioService {

    private final Random random = new Random();

    // Equipos
    private final String[] eq1 = {
            "leones", "tiburones", "toros", "lobos",
            "jaguares", "búfalos", "halcones", "dragones",
            "los mejores", "fantásticos", "invencibles",
            "poderosos", "valientes", "rápidos", "furiosos", "indomables", "imparables",
            "legendarios", "épicos", "supremos"
    };

    private final String[] eq2 = {
            "rojos", "azules", "verdes", "amarillos", "negros",
            "blancos", "naranjas", "morados", "grises", "dorados",
            "eléctricos", "cósmicos", "místicos", "sagrados", "gloriosos",
            "celestiales", "eternos", "infinitos"
    };

    private final String[] eq3 = {
            "de primer año", "de segundo año",
    };

    // Artículos
    private final String[] descripcionesArticulos1 = {
            "Camiseta", "Pantalón corto", "Medias deportivas", "Balón oficial",
            "Zapatillas de fútbol", "Guantes de portero", "Espinilleras", "Sudadera",
            "Chaqueta de chándal", "Mochila deportiva", "Botella de agua", "Bufanda del club",
            "Gorra deportiva", "Muñequeras", "Cinta para el pelo", "Rodilleras",
            "Protector bucal", "Silbato", "Cronómetro", "Conos de entrenamiento",
            "Petos de entrenamiento", "Red de portería", "Bomba de aire", "Aguja para balones",
            "Camiseta de entrenamiento", "Pantalón largo", "Bolsa de deporte", "Toalla",
            "Chanclas", "Calcetines térmicos", "Chubasquero", "Polo del club",
            "Bermudas", "Leggins deportivos", "Top deportivo", "Cortavientos",
            "Chaleco reflectante", "Gafas de sol deportivas", "Reloj deportivo", "Pulsera fitness",
            "Protector solar", "Vendas elásticas", "Spray frío", "Crema muscular",
            "Bidón isotérmico", "Portabotellas", "Silbato electrónico", "Tarjetas de árbitro",
            "Marcador deportivo", "Pizarra táctica"
    };

    private final String[] descripcionesArticulos2 = {
            "oficial", "de entrenamiento", "de alta calidad", "resistente",
            "transpirable", "ajustable", "duradero", "verde", "azul", "rojo",
            "naranja", "de alto rendimiento", "de última generación", "de diseño ergonómico",
            "de diseño moderno", "de edición limitada", "con tecnología avanzada"
    };

    private final String[] descripcionesTipoArticulo = {
            "Material deportivo", "Accesorios", "Calzado deportivo", "Ropa de entrenamiento",
            "Complementos", "Merchandising", "Artículos de portería", "Equipamiento técnico", "Protecciones",
            "Hidratación", "Balones", "Conos y marcadores", "Redes", "Arbitraje",
            "Gimnasio", "Fisioterapia", "Nutrición", "Tecnología deportiva", "Textil técnico",
            "Ropa casual", "Infantil", "Junior", "Senior", "Femenino",
            "Masculino", "Unisex", "Outlet", "Novedades", "Ofertas",
            "Premium", "Básico", "Profesional", "Amateur", "Escolar",
            "Competición", "Ocio", "Verano", "Invierno", "Todo el año",
            "Personalizable", "Edición limitada", "Coleccionismo", "Regalos", "Packs",
            "Temporal", "Permanente", "Exclusivo", "Popular", "Especial"
    };

    // Usuarios
    private final String[] nombresVaron = {
            "Juan", "Carlos", "Luis", "Pedro", "José",
            "Francisco", "Antonio", "Manuel", "David", "Javier",
            "Miguel", "Alejandro", "Rafael", "Daniel", "Fernando",
            "Sergio", "Jorge", "Alberto", "Raúl", "Pablo",
            "Rubén", "Adrián", "Diego", "Iván", "Óscar"
    };

    private final String[] nombresMujer = {
            "María", "Carmen", "Ana", "Laura", "Isabel",
            "Patricia", "Sofía", "Lucía", "Marta", "Elena",
            "Sara", "Cristina", "Raquel", "Beatriz", "Julia",
            "Victoria", "Claudia", "Andrea", "Alba", "Noelia",
            "Silvia", "Natalia", "Irene", "Carla", "Lorena"
    };

    private final String[] apellidos = {
            "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín",
            "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez",
            "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos", "Gil", "Ramírez", "Serrano", "Blanco", "Suárez",
            "Molina", "Castro", "Ortega", "Rubio", "Morales", "Delgado", "Ortiz", "Marín", "Iglesias", "Santos",
            "Castillo", "Garrido", "Calvo", "Peña", "Cruz", "Cano", "Núñez", "Prieto", "Díez", "Lozano"
    };

    // Roles
    private final String[] descripcionesRoles = {
            "Presidente", "Vicepresidente", "Secretario", "Jugador",
            "Tesorero", "Vocal", "Coordinador", "Director Deportivo",
            "Entrenador", "Delegado", "Socio Honorífico",
            "Miembro del Comité", "Asesor Legal", "Responsable de Marketing", "Encargado de Eventos", "Jefe de Prensa",
            "Coordinador de Voluntarios",
            "Responsable de Infraestructuras", "Director de Comunicación", "Coordinador de Patrocinios",
            "Responsable de Relaciones Institucionales",
            "Patrocinador", "Colaborador", "Miembro del Consejo", "Responsable de Formación",
            "Encargado de Redes Sociales",
            "Responsable de Seguridad", "Coordinador de Actividades", "Jefe de Proyectos", "Responsable de Tecnología",
            "Encargado de Logística",
            "Árbitro", "Médico", "Fisioterapeuta", "Nutricionista", "Psicólogo Deportivo",
            "Analista de Datos", "Preparador Físico",
            "Scout", "Fotógrafo", "Videógrafo",
            "Periodista Deportivo", "Community Manager", "Diseñador Gráfico", "Desarrollador Web",
            "Administrador de Sistemas", "Especialista en SEO",
            "Consultor de Negocios", "Asistente Administrativo"
    };

    // Ligas y Temporadas
    private final String[] nombresLigas = {
            "Liga", "Copa", "Supercopa", "Liga de Campeones", "Liga Europa", "Torneo",
            "Trofeo", "Campeonato", "Playoff", "Liguilla Clasificatoria", "Liguilla Eliminatoria"
    };

    private final String[] nombresLigas2 = {
            "Primera División", "Segunda División", "Tercera División", "División de Honor",
            "División de Plata", "División de Bronce", "Nacional", "Regional", "Provincial", "Local",
            "Amateur", "de Campeones", "Outdoor", "Indoor", "de Verano", "de Invierno",
            "Internacional", "de Clubes", "de Selecciones", "de ascenso", "de descenso", "de élite",
            "de Honor", "de Plata", "de Bronce"
    };

    private final String[] añosTemporada = {
            "2019/2020",
            "2020/2021",
            "2021/2022",
            "2022/2023",
            "2023/2024",
            "2024/2025",
    };

    private final String[] categoriasTemporada = {
            "Infantil",
            "Junior",
            "Senior",
            "Femenino",
            "Masculino",
            "Unisex",
            "Escolar",
            "Competición",
            "Ocio"
    };

    private final String[] estaciones = {
            "Primavera",
            "Otoño",
            "Verano",
            "Invierno",
            "Todo el año"
    };

    // Noticias
    private final String[] frasesNoticias = {
            "La vida es bella.",
            "El conocimiento es poder.",
            "La perseverancia es la clave del éxito.",
            "El tiempo es oro.",
            "La creatividad es la inteligencia divirtiéndose.",
            "Más vale tarde que nunca.",
            "El cambio es la única constante en la vida.",
            "La esperanza es lo último que se pierde.",
            "La unión hace la fuerza.",
            "El respeto es la base de toda relación.",
            "La comunicación es clave en cualquier relación.",
            "Más vale pájaro en mano que ciento volando.",
            "A mal tiempo, buena cara.",
            "El que no arriesga no gana.",
            "La suerte favorece a los audaces.",
            "El tiempo lo dirá."
    };

    // Globales
    private static final String[] CATEGORIAS = {"Querubín", "Pre-benjamín", "Benjamín", "Alevín", "Infantil", "Cadete", "Juvenil", "Amateur"};

    private static final String[] LUGARES = {
            "Estadio Municipal", "Polideportivo Central", "Campo Norte", "Pabellón Sur",
            "Estadio La Rosaleda", "Campo de Los Pinos", "Instalaciones Deportivas Norte",
            "Pabellón Polideportivo", "Estadio El Sardinero", "Campo Municipal de Deportes",
            "Pabellón de los Deportes", "Complejo Deportivo", "Estadio Nuevo Arcángel",
            "Campo de Fútbol Municipal", "Piscina Cubierta", "Velódromo Municipal"
    };

    // Elementos aleatorios individuales

    public String getNombreVaronAleatorio() {
        return nombresVaron[random.nextInt(nombresVaron.length)];
    }

    public String getNombreMujerAleatorio() {
        return nombresMujer[random.nextInt(nombresMujer.length)];
    }

    public String getApellidoAleatorio() {
        return apellidos[random.nextInt(apellidos.length)];
    }

    public String getNombreLigaAleatorio() {
        return nombresLigas[random.nextInt(nombresLigas.length)];
    }

    public String getNombreLiga2Aleatorio() {
        return nombresLigas2[random.nextInt(nombresLigas2.length)];
    }

    public String getNombreLigaCompuestoAleatorio() {
        return nombresLigas[random.nextInt(nombresLigas.length)] + " "
                + nombresLigas2[random.nextInt(nombresLigas2.length)];
    }

    public String getAnoTemporadaAleatorio() {
        return añosTemporada[random.nextInt(añosTemporada.length)];
    }

    public String getCategoriaTemporadaAleatoria() {
        return categoriasTemporada[random.nextInt(categoriasTemporada.length)];
    }

    public String getEstacionAleatoria() {
        return estaciones[random.nextInt(estaciones.length)];
    }

    public String getDescripcionRolAleatoria() {
        return descripcionesRoles[random.nextInt(descripcionesRoles.length)];
    }

    public String getDescripcionRol(int index) {
        return descripcionesRoles[index];
    }

    public int getNumDescripcionesRoles() {
        return descripcionesRoles.length;
    }

    public String getDescripcionTipoArticuloAleatoria() {
        return descripcionesTipoArticulo[random.nextInt(descripcionesTipoArticulo.length)];
    }

    public String getDescripcionTipoArticulo(int index) {
        return descripcionesTipoArticulo[index];
    }

    public int getNumDescripcionesTipoArticulo() {
        return descripcionesTipoArticulo.length;
    }

    public String getFraseNoticiaAleatoria() {
        return frasesNoticias[random.nextInt(frasesNoticias.length)];
    }

    public String getLugarAleatorio() {
        return LUGARES[random.nextInt(LUGARES.length)];
    }

    // Generación aleatoria compuesta

    public String getDescripcionArticulo() {
        return descripcionesArticulos1[random.nextInt(descripcionesArticulos1.length)] + " "
                + descripcionesArticulos2[random.nextInt(descripcionesArticulos2.length)];
    }

    public String getCategoriaAleatoria() {
        return CATEGORIAS[random.nextInt(CATEGORIAS.length)];
    }

    public String generarNombreEquipoAleatorio() {
        String nombre = eq1[random.nextInt(eq1.length)] + " "
                + eq2[random.nextInt(eq2.length)];
        if (random.nextDouble() < 0.3) {
            nombre += " " + eq3[random.nextInt(eq3.length)];
        }
        return primeraMayuscuString(nombre);
    }

    public String generarNombreLugarAleatorio() {
        return getLugarAleatorio();
    }

    // Números aleatorios

    public int generarNumeroAleatorioEnteroEnRango(int min, int max) {
        return random.nextInt(max - min + 1) + min;
    }

    public double generarNumeroAleatorioDecimalEnRango(double min, double max) {
        return Math.round((random.nextDouble() * (max - min) + min) * 100.0) / 100.0;
    }

    // Utilidades

    public String primeraMayuscuString(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }

    public String eliminarAcentos(String input) {
        String[][] acentos = {
                {"á", "a"}, {"é", "e"}, {"í", "i"}, {"ó", "o"}, {"ú", "u"},
                {"Á", "A"}, {"É", "E"}, {"Í", "I"}, {"Ó", "O"}, {"Ú", "U"},
                {"ñ", "ny"}, {"Ñ", "NY"}
        };
        for (String[] par : acentos) {
            input = input.replace(par[0], par[1]);
        }
        return input;
    }

}
