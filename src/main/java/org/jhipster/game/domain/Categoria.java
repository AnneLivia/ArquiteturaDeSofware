package org.jhipster.game.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Categoria.
 */
@Entity
@Table(name = "categoria")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Categoria implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @ManyToMany(mappedBy = "categorias")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "fornecedor", "categorias" }, allowSetters = true)
    private Set<Jogo> jogos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Categoria id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Categoria nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<Jogo> getJogos() {
        return this.jogos;
    }

    public void setJogos(Set<Jogo> jogos) {
        if (this.jogos != null) {
            this.jogos.forEach(i -> i.removeCategoria(this));
        }
        if (jogos != null) {
            jogos.forEach(i -> i.addCategoria(this));
        }
        this.jogos = jogos;
    }

    public Categoria jogos(Set<Jogo> jogos) {
        this.setJogos(jogos);
        return this;
    }

    public Categoria addJogo(Jogo jogo) {
        this.jogos.add(jogo);
        jogo.getCategorias().add(this);
        return this;
    }

    public Categoria removeJogo(Jogo jogo) {
        this.jogos.remove(jogo);
        jogo.getCategorias().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Categoria)) {
            return false;
        }
        return id != null && id.equals(((Categoria) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Categoria{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            "}";
    }
}
