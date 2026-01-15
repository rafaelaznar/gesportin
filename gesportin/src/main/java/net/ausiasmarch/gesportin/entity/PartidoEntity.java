package net.ausiasmarch.gesportin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "partido")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartidoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 3, max = 1024)
    private String rival;

    @NotNull
    @ManyToOne(fetch = FetchType. EAGER)
    @JoinColumn(name = "id_liga")
    private LigaEntity id_liga;

    @NotNull
    @Column(nullable = false)
    private Boolean local;

    @NotNull
    @Size(min = 3, max = 1024)
    private String resultado;
    
}