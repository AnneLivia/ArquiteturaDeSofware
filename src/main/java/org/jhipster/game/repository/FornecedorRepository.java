package org.jhipster.game.repository;

import org.jhipster.game.domain.Fornecedor;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Fornecedor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {}
