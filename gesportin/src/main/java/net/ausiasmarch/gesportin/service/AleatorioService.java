package net.ausiasmarch.gesportin.service;

import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class AleatorioService {

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
        "de diseño moderno", "de edición limitada", "con tecnología avanzada"};

    private static final String[] CATEGORIAS = {"Querubín", "Pre-benjamín", "Benjamín", "Alevín", "Infantil", "Cadete", "Juvenil", "Amateur"};

    private final Random random = new Random();

    private final String[] eq3 = {
        "de primer año", "de segundo año",};

    public String getDescripcionArticulo() {
        return descripcionesArticulos1[random.nextInt(descripcionesArticulos1.length)] + " " + descripcionesArticulos2[random.nextInt(descripcionesArticulos2.length)];
    }

    public String getCategoriaAleatoria() {
        return CATEGORIAS[random.nextInt(CATEGORIAS.length)];
    }

    public String primeraMayuscuString(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }

    public String generarNombreEquipoAleatorio() {
        String nombre = eq1[(int) (Math.random() * eq1.length)] + " "
                + eq2[(int) (Math.random() * eq2.length)];
        if (Math.random() < 0.3) {
            nombre += " " + eq3[(int) (Math.random() * eq3.length)];
        }
        return primeraMayuscuString(nombre);
    }

    private static final String[] LUGARES = {
        "Estadio Municipal", "Polideportivo Central", "Campo Norte", "Pabellón Sur",
        "Estadio La Rosaleda", "Campo de Los Pinos", "Instalaciones Deportivas Norte",
        "Pabellón Polideportivo", "Estadio El Sardinero", "Campo Municipal de Deportes",
        "Pabellón de los Deportes", "Complejo Deportivo", "Estadio Nuevo Arcángel",
        "Campo de Fútbol Municipal", "Piscina Cubierta", "Velódromo Municipal"
    };

    public String generarNombreLugarAleatorio() {
        return LUGARES[(int) (Math.random() * LUGARES.length)];
    }

    public int generarNumeroAleatorioEnteroEnRango(int min, int max) {
        return (int) (Math.random() * (max - min + 1)) + min;
    }

    public double generarNumeroAleatorioDecimalEnRango(double min, double max) {
        return Math.round((Math.random() * (max - min) + min) * 100.0) / 100.0;
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
