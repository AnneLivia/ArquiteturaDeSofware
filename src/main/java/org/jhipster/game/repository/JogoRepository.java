package org.jhipster.game.repository;

import java.util.List;
import java.util.Optional;
import org.jhipster.game.domain.Jogo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Jogo entity.
 */
@Repository
public interface JogoRepository extends JpaRepository<Jogo, Long> {
    @Query(
        value = "select distinct jogo from Jogo jogo left join fetch jogo.categorias",
        countQuery = "select count(distinct jogo) from Jogo jogo"
    )
    Page<Jogo> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct jogo from Jogo jogo left join fetch jogo.categorias")
    List<Jogo> findAllWithEagerRelationships();

    @Query("select jogo from Jogo jogo left join fetch jogo.categorias where jogo.id =:id")
    Optional<Jogo> findOneWithEagerRelationships(@Param("id") Long id);
}
