package com.cadastro.demonstrativo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    // Relacionamento Inverso: Um usuário tem muitos posts
    // mappedBy indica que o campo 'autor' na classe Post é o dono do relacionamento
    @OneToMany(mappedBy = "autor", cascade = CascadeType.ALL)
    @JsonIgnore // Evita recursão infinita ao serializar para JSON
    private List<Post> posts;
}