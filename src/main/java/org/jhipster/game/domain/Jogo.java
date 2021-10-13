package org.jhipster.game.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Jogo.
 */
@Entity
@Table(name = "jogo")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Jogo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "ano")
    private LocalDate ano;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "preco")
    private Double preco;

    @Column(name = "image")
    private String image;

    @Column(name = "estoque")
    private Integer estoque;

    @ManyToOne
    private Fornecedor fornecedor;

    @ManyToMany
    @JoinTable(
        name = "rel_jogo__categoria",
        joinColumns = @JoinColumn(name = "jogo_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "jogos" }, allowSetters = true)
    private Set<Categoria> categorias = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Jogo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Jogo nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getAno() {
        return this.ano;
    }

    public Jogo ano(LocalDate ano) {
        this.setAno(ano);
        return this;
    }

    public void setAno(LocalDate ano) {
        this.ano = ano;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Jogo descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getPreco() {
        return this.preco;
    }

    public Jogo preco(Double preco) {
        this.setPreco(preco);
        return this;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }

    public String getImage() {
        return this.image;
    }

    public Jogo image(String image) {
        this.setImage(image);
        return this;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getEstoque() {
        return this.estoque;
    }

    public Jogo estoque(Integer estoque) {
        this.setEstoque(estoque);
        return this;
    }

    public void setEstoque(Integer estoque) {
        this.estoque = estoque;
    }

    public Fornecedor getFornecedor() {
        return this.fornecedor;
    }

    public void setFornecedor(Fornecedor fornecedor) {
        this.fornecedor = fornecedor;
    }

    public Jogo fornecedor(Fornecedor fornecedor) {
        this.setFornecedor(fornecedor);
        return this;
    }

    public Set<Categoria> getCategorias() {
        return this.categorias;
    }

    public void setCategorias(Set<Categoria> categorias) {
        this.categorias = categorias;
    }

    public Jogo categorias(Set<Categoria> categorias) {
        this.setCategorias(categorias);
        return this;
    }

    public Jogo addCategoria(Categoria categoria) {
        this.categorias.add(categoria);
        categoria.getJogos().add(this);
        return this;
    }

    public Jogo removeCategoria(Categoria categoria) {
        this.categorias.remove(categoria);
        categoria.getJogos().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Jogo)) {
            return false;
        }
        return id != null && id.equals(((Jogo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Jogo{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", ano='" + getAno() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", preco=" + getPreco() +
            ", image='" + getImage() + "'" +
            ", estoque=" + getEstoque() +
            "}";
    }
}
